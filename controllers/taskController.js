//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Checkgroup } from "../middlewares/auth.js";

import sendMail from "../utils/nodemailer.js";

//get all Tasks for current app
export const getTasks = catchAsyncErrors(async (req, res, next) => {
    const { task_app_acronym } = req.body;

    //get all task in database for respective app
    const [data, fields] = await connection.execute(`SELECT * FROM tasks WHERE task_app_acronym= ? ;`, [task_app_acronym]);

    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//get Tasks by ID
export const getTaskByID = catchAsyncErrors(async (req, res, next) => {
    const { task_id } = req.body;

    //get all task in database for respective app
    const [data, fields] = await connection.execute(`SELECT * FROM tasks WHERE task_id= ? ;`, [task_id]);

    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//new task api
export const newTask = catchAsyncErrors(async (req, res, next) => {
    // get task details from req body
    var { task_name, task_description, task_notes, task_plan, task_app_acronym } = req.body;
    const task_creator = req.user["username"];
    const task_owner = task_creator;
    const task_status = "open";
    const task_createdate = Math.floor(Date.now() / 1000);

    //field check
    //no special char, <45 char, word or word+numeric
    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]{1,45}$/.test(task_name)) return next(new ErrorHandler("task_name is required and needs to be <45 char, no special char, word or word+numeric", 400, "ER_FIELD_INVALID"));
    if (task_description) {
        //if no description dont need check
        if (!/^.{1,255}$/.test(task_description)) return next(new ErrorHandler("task_description needs to be <255 char", 400, "ER_FIELD_INVALID"));
    }
    if (!(task_creator && task_createdate)) return next(new ErrorHandler("task_creator/task_createdate is somehow missing?", 400, "ER_FIELD_INVALID"));
    if (!task_app_acronym) return next(new ErrorHandler("task_app_acronym is somehow missing?? (task is not tied to app)", 400, "ER_FIELD_INVALID"));

    //check permit to create task, from application table column "app_permit_create" (get r number here as well)
    let [dataPermit, field1] = await connection.execute(`SELECT app_permit_create , app_rnumber FROM applications  WHERE app_acronym= ? ;`, [task_app_acronym]);
    //no app found so cant create plan for app
    if (dataPermit.length == 0) return next(new ErrorHandler(`No app found for ${task_app_acronym}`, 400, "ER_FIELD_INVALID"));
    const permittedRole = dataPermit[0]["app_permit_create"];
    var authorized = await Checkgroup(req.user["username"], [permittedRole]);
    //if authorized =false means user not allowed
    if (!authorized) return next(new ErrorHandler(`Role(${req.user["groupname"]}) is not allowed to create new task.`, 403, "ER_NOT_LOGIN"));

    if (task_plan) {
        //check if plan exist only if plan is provided, else assign task to app
        let [dataPlan, field2] = await connection.execute(`SELECT plan_mvp_name FROM plans WHERE plan_mvp_name= ? AND plan_app_acronym = ?;`, [task_plan, task_app_acronym]);
        //no plan found so cant create task for plan
        if (dataPlan.length == 0) return next(new ErrorHandler(`No plan named ${task_plan} found for app named ${task_app_acronym}`, 400, "ER_FIELD_INVALID"));
    }

    //get number from database app r number
    var task_id = `${task_app_acronym}_${dataPermit[0]["app_rnumber"] + 1}`;

    var today = new Date(Date.now());
    //append audit trail to notes
    task_notes = `\n----------------------------------------------------------------------\nTask Created by ${req.user["username"]} on\n${today}\n########## -----NOTES----- ##########\n${task_notes}\n`;

    //try to insert data to database
    const [data, fields] = await connection.execute(`INSERT INTO tasks VALUES (?,?,?,?,?,?,?,?,?,?);`, [task_name, task_id, task_description, task_status, task_creator, task_owner, task_createdate, task_notes, task_plan, task_app_acronym]);

    //update r number for app
    const [dataUpdate, fieldsUpdate] = await connection.execute(`UPDATE applications SET app_rnumber = ? WHERE app_acronym=?;`, [dataPermit[0]["app_rnumber"] + 1, task_app_acronym]);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully created task",
    });
});

//edit task api
export const editTask = catchAsyncErrors(async (req, res, next) => {
    //get task details from req body
    var { task_id, task_description, task_status, task_notes, task_plan, action } = req.body;
    const task_owner = req.user["username"];

    //field check
    if (!(task_id && task_status)) return next(new ErrorHandler("task_id / task_status is somehow missing??", 400, "ER_FIELD_INVALID"));
    if (task_description) {
        //if no description dont need check
        if (!/^.{1,255}$/.test(task_description)) return next(new ErrorHandler("task_description needs to be <255 char", 400, "ER_FIELD_INVALID"));
    }

    //get latest task state
    let [dataTask, field] = await connection.execute(`SELECT * FROM tasks WHERE task_id= ?;`, [task_id]);
    //if no task found with id??? return error
    if (dataTask.length == 0) return next(new ErrorHandler(`Task not found???`, 400, "ER_FIELD_INVALID"));
    const latestTaskState = dataTask[0];
    //compare user request task state and task state in database, if not equal -> user sent stale data, ask them to refresh
    if (!(latestTaskState.task_status == task_status)) return next(new ErrorHandler(`Task state has been changed, please refresh`, 410, "ER_REFRESH"));

    //if user trying to update plan make sure new plan is defined
    if (task_plan) {
        //check if plan exist only if plan is provided, else assign task to app
        let [dataPlan, field] = await connection.execute(`SELECT plan_mvp_name FROM plans WHERE plan_mvp_name= ? AND plan_app_acronym = ?;`, [task_plan, latestTaskState.task_app_acronym]);
        //no plan found so cant create task for plan
        if (dataPlan.length == 0) return next(new ErrorHandler(`No plan named ${task_plan} found for app named ${latestTaskState.task_app_acronym}`, 400, "ER_FIELD_INVALID"));
    }

    var permitSelect = "";
    var new_status = task_status;
    switch (task_status) {
        case "open":
            permitSelect = `app_permit_open`;
            switch (action) {
                case "promote":
                    new_status = "todo";
                    break;
                case "demote":
                    return next(new ErrorHandler(`cant demote open status`, 400, "ER_FIELD_INVALID"));
                default:
                    break;
            }
            break;
        case "todo":
            permitSelect = `app_permit_todolist`;
            if (task_plan != latestTaskState.task_plan) return next(new ErrorHandler(`cant change plan....`, 400, "ER_FIELD_INVALID"));
            switch (action) {
                case "promote":
                    new_status = "doing";
                    break;
                case "demote":
                    return next(new ErrorHandler(`cant demote todo status`, 400, "ER_FIELD_INVALID"));
                default:
                    break;
            }
            break;
        case "doing":
            permitSelect = `app_permit_doing`;
            if (task_plan != latestTaskState.task_plan) return next(new ErrorHandler(`cant change plan....`, 400, "ER_FIELD_INVALID"));
            switch (action) {
                case "promote":
                    new_status = "done";
                    break;
                case "demote":
                    new_status = "todo";
                    break;
                default:
                    break;
            }
            break;
        case "done":
            permitSelect = `app_permit_done`;
            switch (action) {
                case "promote":
                    if (task_plan != latestTaskState.task_plan) return next(new ErrorHandler(`cant change plan....`, 400, "ER_FIELD_INVALID"));
                    new_status = "closed";
                    break;
                case "demote":
                    new_status = "doing";
                    break;
                default:
                    if (task_plan != latestTaskState.task_plan) return next(new ErrorHandler(`cant change plan....`, 400, "ER_FIELD_INVALID"));
                    break;
            }
            break;
        case "closed":
            return next(new ErrorHandler(`cant operate on "Done" task`, 400, "ER_FIELD_INVALID"));
        default:
            return next(new ErrorHandler(`invalid task state???`, 400, "ER_FIELD_INVALID"));
    }

    //check permit to act on task with state, from application table column "app_permit_?"
    let [dataPermit, field1] = await connection.execute(`SELECT * FROM applications  WHERE app_acronym= ? ;`, [latestTaskState.task_app_acronym]);
    const permittedRole = dataPermit[0][permitSelect];
    var authorized = await Checkgroup(req.user["username"], [permittedRole]);
    //if authorized =false means user not allowed
    if (!authorized) return next(new ErrorHandler(`Role(${req.user["groupname"]}) is not allowed to act on '${task_status}' state.`, 403, "ER_NOT_LOGIN"));

    var today = new Date(Date.now());
    //append logs to task notes
    task_notes = `----------------------------------------------------------------------\n${task_status} --> ${new_status} edited by ${req.user["username"]} on\n${today}\n########## -----NOTES----- ##########\n${task_notes}\n`;

    //try to update data to database
    const [data, fields] = await connection.execute(`UPDATE tasks SET task_description=? , task_status=? , task_owner=? , task_notes=CONCAT(?,COALESCE(task_notes,'')) , task_plan=? WHERE task_id=?;`, [task_description, new_status, task_owner, task_notes, task_plan, task_id]);
    //check result of update
    if (data.affectedRows == 0) return next(new ErrorHandler(`Error updating task, please try again`, 400, "ER_FIELD_INVALID"));

    //handle send mail
    if (task_status == "doing" && new_status == "done") {
        let plrole = dataPermit[0]["app_permit_create"];
        //get email data of all pl role
        const [emaildata, fields] = await connection.execute(`SELECT email FROM nodelogin.accounts  WHERE groupname=? OR groupname LIKE ? OR groupname LIKE ? OR groupname LIKE ? ;`, [plrole, `${plrole},%`, `%,${plrole}`, `%,${plrole},%`]);
        let emailArr = emaildata.map(({ email }) => email);
        console.log(`sending email to users with this role $(plrole) with the following email : ` + emailArr);

        // send email to all projectlead in app
        sendMail(emailArr, `Task review for taskID ${task_id}`, `Please review task for promotion to close at http://localhost:3001/app/${latestTaskState.task_app_acronym}`);
    }

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully edited task",
    });
});
