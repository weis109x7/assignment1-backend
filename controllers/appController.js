//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//get all apps
export const getApps = catchAsyncErrors(async (req, res, next) => {
    //if app_acronym provided in body then get specific ap else get all apps
    const { app_acronym } = req.body;
    if (app_acronym) {
        const [data, fields] = await connection.execute(`SELECT * FROM applications WHERE app_acronym=?;`, [app_acronym]);
        //return success message when success
        //catch async error will throw error if query failed
        return res.status(200).json({
            success: true,
            message: data,
        });
    } else {
        //get all apps in database
        const [data, fields] = await connection.execute(`SELECT * FROM applications;`);
        //return success message when success
        //catch async error will throw error if query failed
        return res.status(200).json({
            success: true,
            message: data,
        });
    }
});

//newUser api
export const newApp = catchAsyncErrors(async (req, res, next) => {
    //get app details from req body
    var { app_acronym, app_description, app_rnumber, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done } = req.body;

    //field check
    //no special char, <45 char, word or word+numeric
    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]{1,45}$/.test(app_acronym)) return next(new ErrorHandler("app acronym needs to be <45 char, no special char, word or word+numeric", 400, "ER_FIELD_INVALID"));
    if (app_description) {
        //if no description dont need check
        if (!/^.{1,255}$/.test(app_description)) return next(new ErrorHandler("app description needs to be <255 char", 400, "ER_FIELD_INVALID"));
    }
    if (!app_rnumber) return next(new ErrorHandler("app r number is missing", 400, "ER_FIELD_INVALID"));
    if (!(app_rnumber >= 0 && app_rnumber <= 100000)) return next(new ErrorHandler("app rnumber needs to be between 0 and 100000", 400, "ER_FIELD_INVALID"));
    if (!(app_startdate && app_enddate)) return next(new ErrorHandler("app start date end date somehow missing?", 400, "ER_FIELD_INVALID"));
    if (!(app_permit_create && app_permit_open && app_permit_todolist && app_permit_doing && app_permit_done)) return next(new ErrorHandler("app permissions somehow missing?", 400, "ER_FIELD_INVALID"));

    //try to insert data to database
    const [data, fields] = await connection.execute(`INSERT INTO applications VALUES (?,?,?,?,?,?,?,?,?,?);`, [app_acronym, app_description, app_rnumber, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done]);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully created app",
    });
});

//edit app api
export const editApp = catchAsyncErrors(async (req, res, next) => {
    //get app details from req body
    var { app_acronym, app_description, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done } = req.body;

    //field check
    if (app_description) {
        //if no description dont need check
        if (!/^.{1,255}$/.test(app_description)) return next(new ErrorHandler("app description needs to be <255 char", 400, "ER_FIELD_INVALID"));
    }
    if (!(app_startdate && app_enddate)) return next(new ErrorHandler("app start date end date somehow missing?", 400, "ER_FIELD_INVALID"));
    if (!(app_permit_create && app_permit_open && app_permit_todolist && app_permit_doing && app_permit_done)) return next(new ErrorHandler("app permissions somehow missing?", 400, "ER_FIELD_INVALID"));

    const [data, fields] = await connection.execute(`UPDATE applications SET app_description = ? ,app_startdate = ?, app_enddate = ? , app_permit_create = ? , app_permit_open = ? , app_permit_todolist = ? , app_permit_doing = ? , app_permit_done = ?  WHERE app_acronym=?;`, [app_description, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done, app_acronym]);

    //check result of update
    if (data.affectedRows == 0) return next(new ErrorHandler(`No app called ${app_acronym}`, 400, "ER_FIELD_INVALID"));
    console.log(data);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully edited app",
    });
});
