//import essentials
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import bcrypt from "bcryptjs";

import sendMail from "../utils/nodemailer.js";

//import essentials
import mysql from "mysql2";
//load config env
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
//load variabes from config.env
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
//throw error if env not set
if (!dbHost || !dbPort || !dbUsername || !dbPassword || !dbName) {
    throw new Error("database environment variables must be set");
}
// create the connection to database
const connect = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
});
const connection = connect.promise();

//get all Tasks for current app
export const GetTaskbyState = catchAsyncErrors(async (req, res, next) => {
    const { username, password, task_app_acronym, task_status } = req.body;
    if (!(username && password && task_app_acronym && task_status))
        return res.status(200).json({
            code: "V2",
        });

    const user = await isAuthenthicated(username, password);
    if (!user)
        return res.status(200).json({
            code: "A1",
        });

    if (!(task_status == "open" || task_status == "todo" || task_status == "doing" || task_status == "done" || task_status == "closed")) {
        return res.status(200).json({
            code: "E1",
        });
    }

    //check app exist
    const [appData, fields1] = await connection.execute(`SELECT * FROM applications WHERE app_acronym= ? ;`, [task_app_acronym]);
    if (appData.length == 0)
        return res.status(200).json({
            code: "E2",
        });

    //get all task in database for respective app
    const [data, fields] = await connection.execute(`SELECT * FROM tasks WHERE task_app_acronym= ? AND task_status= ?;`, [task_app_acronym, task_status]);

    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        code: "S1",
        results: data,
    });
});

//new task api
export const CreateTask = catchAsyncErrors(async (req, res, next) => {
    // get task details from req body
    var { username, password, task_name, task_description, task_notes, task_plan, task_app_acronym } = req.body;

    if (!task_description) {
        task_description = null;
    }
    if (!task_plan) {
        task_plan = "";
    }

    if (!(username && password && task_name && task_app_acronym))
        return res.status(200).json({
            code: "V2",
        });
    const user = await isAuthenthicated(username, password);
    if (!user)
        return res.status(200).json({
            code: "A1",
        });

    const task_creator = username;
    const task_owner = username;
    const task_status = "open";
    const task_createdate = Math.floor(Date.now() / 1000);

    //check permit to create task, from application table column "app_permit_create" (get r number here as well)
    let [dataPermit, field1] = await connection.execute(`SELECT app_acronym, app_permit_create , app_rnumber FROM applications  WHERE app_acronym= ? ;`, [task_app_acronym]);
    //no app found so cant create plan for app
    if (dataPermit.length == 0)
        return res.status(200).json({
            code: "A2",
        });
    const permittedRole = dataPermit[0]["app_permit_create"];
    var authorized = user["groupname"].includes(permittedRole);
    //if authorized =false means user not allowed
    if (!authorized)
        return res.status(200).json({
            code: "A3",
        });

    //field check
    //no special char, <45 char, word or word+numeric
    if (!/^(?=.{1,45}$)[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*$/.test(task_name))
        return res.status(200).json({
            code: "E1",
        });
    if (task_description) {
        //if no description dont need check
        if (!/^.{1,255}$/.test(task_description))
            return res.status(200).json({
                code: "E2",
            });
    }

    if (task_plan) {
        //check if plan exist only if plan is provided, else assign task to app
        let [dataPlan, field2] = await connection.execute(`SELECT plan_mvp_name FROM plans WHERE plan_mvp_name= ? AND plan_app_acronym = ?;`, [task_plan, task_app_acronym]);
        //no plan found so cant create task for plan
        if (dataPlan.length == 0)
            return res.status(200).json({
                code: "E4",
            });
    }

    //get number from database app r number
    var task_id = `${dataPermit[0]["app_acronym"]}_${dataPermit[0]["app_rnumber"] + 1}`;

    var today = new Date(Date.now());
    //append audit trail to notes
    task_notes = `\n----------------------------------------------------------------------\nTask Created by ${user["username"]} on\n${today}\n########## -----NOTES----- ##########\n${task_notes}\n`;

    //try to insert data to database
    const [data, fields] = await connection.execute(`INSERT INTO tasks VALUES (?,?,?,?,?,?,?,?,?,?);`, [task_name, task_id, task_description, task_status, task_creator, task_owner, task_createdate, task_notes, task_plan, task_app_acronym]);

    //update r number for app
    const [dataUpdate, fieldsUpdate] = await connection.execute(`UPDATE applications SET app_rnumber = ? WHERE app_acronym=?;`, [dataPermit[0]["app_rnumber"] + 1, task_app_acronym]);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        task_id: task_id,
        code: "S1",
    });
});

//edit task api
export const PromoteTask2Done = catchAsyncErrors(async (req, res, next) => {
    //get task details from req body
    var { username, password, task_id, task_notes } = req.body;

    if (!(username && password && task_id))
        return res.status(200).json({
            code: "V2",
        });

    const user = await isAuthenthicated(username, password);
    if (!user)
        return res.status(200).json({
            code: "A1",
        });

    const task_owner = username;

    //check permit to act on task with state, from application table column "app_permit_?"
    let [dataPermit, field1] = await connection.execute(`SELECT * FROM applications  WHERE app_acronym= ? ;`, [task_id.split("_")[0]]);
    //no app found so cant access perms for app
    if (dataPermit.length == 0)
        return res.status(200).json({
            code: "A2",
        });
    const permittedRole = dataPermit[0]["app_permit_doing"];
    var authorized = user["groupname"].includes(permittedRole);
    //if authorized =false means user not allowed
    if (!authorized)
        return res.status(200).json({
            code: "A3",
        });

    //get latest task state
    let [dataTask, field] = await connection.execute(`SELECT * FROM tasks WHERE task_id= ?;`, [task_id]); //seperate taskid and state check
    //if no task found with id and in doing state??? return error
    if (dataTask.length == 0)
        return res.status(200).json({
            code: "E1",
        });
    const latestTaskState = dataTask[0];

    if (latestTaskState.task_status != "doing") {
        return res.status(200).json({
            code: "E2",
        });
    }

    var today = new Date(Date.now());
    //append logs to task notes
    task_notes = `----------------------------------------------------------------------\nTask Status changed from ${"doing"} --> ${"done"} edited by ${user["username"]} on\n${today}\nPlan changed from {${latestTaskState.task_plan ? latestTaskState.task_plan : `-NO-PLAN-`}} to {${latestTaskState.task_plan ? latestTaskState.task_plan : `-NO-PLAN-`}}\n########## -----NOTES----- ##########\n${task_notes}\n`;

    //try to update data to database
    const [data, fields] = await connection.execute(`UPDATE tasks SET task_status="done" , task_owner=? , task_notes=CONCAT(?,COALESCE(task_notes,''))  WHERE task_id=?;`, [task_owner, task_notes, task_id]);
    //check result of update
    if (data.affectedRows == 0)
        return res.status(200).json({
            code: "GG420",
        });
    //handle send mail
    let plrole = dataPermit[0]["app_permit_create"];
    //get email data of all pl role
    const [emaildata, fields1] = await connection.execute(`SELECT email FROM nodelogin.accounts  WHERE groupname=? OR groupname LIKE ? OR groupname LIKE ? OR groupname LIKE ? ;`, [plrole, `${plrole},%`, `%,${plrole}`, `%,${plrole},%`]);
    let emailArr = emaildata.map(({ email }) => email);
    console.log(`sending email to users with this role $(plrole) with the following email : ` + emailArr);

    // send email to all projectlead in app
    sendMail(emailArr, `Task review for taskID ${task_id}`, `Please review task for promotion to close at http://localhost:3001/app/${latestTaskState.task_app_acronym}`);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        code: "S1",
    });
});

//handle user authenthicating
const isAuthenthicated = catchAsyncErrors(async (username, password) => {
    //return if null
    if (!username || !password) return;
    //look in db for account and retrive passhash to compare
    const [data, fields] = await connection.execute(`SELECT username,password,email,groupname,isactive FROM accounts  WHERE username=?;`, [username]);
    //no user found
    if (data.length == 0) return;
    //check password match
    const passMatched = await bcrypt.compare(password, data[0]["password"]);
    //not matched return error
    if (!passMatched) return;
    //check status of account
    if (data[0].isactive == "disabled") return;

    //remove password from user data, add token to user data
    delete data[0].password;
    //convert groupname from comma seperated to array
    data[0]["groupname"] = data[0]["groupname"] ? data[0]["groupname"].split(",") : [];

    //return user data
    return data[0];
});
