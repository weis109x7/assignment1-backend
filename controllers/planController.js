//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Checkgroup } from "../middlewares/auth.js";

//get all plans
export const getPlans = catchAsyncErrors(async (req, res, next) => {
    const { app_acronym } = req.body;

    //get all plans in database for respective app
    const [data, fields] = await connection.execute(`SELECT * FROM plans WHERE plan_app_acronym= ? ;`, [app_acronym]);
    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//new plan api
export const newPlan = catchAsyncErrors(async (req, res, next) => {
    //get app details from req body
    var { plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym } = req.body;

    //field check
    //no special char, <45 char, word or word+numeric
    if (!/^(?=.{1,45}$)[a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*$/.test(plan_mvp_name)) return next(new ErrorHandler("plan name must be not more than 45 char, no trailing and leading whitespaces, no special characters", 400, "ER_FIELD_INVALID"));
    if (!(plan_startdate && plan_enddate)) return next(new ErrorHandler("plan start date and/or end date is missing?", 400, "ER_FIELD_INVALID"));
    if (!plan_app_acronym) return next(new ErrorHandler("plan app acronym is somehow missing?? (plan is not tied to app)", 400, "ER_FIELD_INVALID"));

    //check permit to create plan, from application table column "app_permit_open"
    let [dataPermit, field1] = await connection.execute(`SELECT app_permit_open FROM applications  WHERE app_acronym= ? ;`, [plan_app_acronym]);
    //no app found so cant create plan for app
    if (dataPermit.length == 0) return next(new ErrorHandler(`No app found for ${plan_app_acronym}`, 400, "ER_FIELD_INVALID"));
    const permittedRole = dataPermit[0]["app_permit_open"];
    var authorized = await Checkgroup(req.user["username"], [permittedRole]);
    //if authorized =false means user not allowed
    if (!authorized) return next(new ErrorHandler(`Role(${req.user["groupname"]}) is not allowed to create new plan.`, 403, "ER_NOT_LOGIN"));

    //try to insert data to database
    const [data, fields] = await connection.execute(`INSERT INTO plans VALUES (?,?,?,?);`, [plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym]);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully created plan",
    });
});

//edit app api
export const editPlan = catchAsyncErrors(async (req, res, next) => {
    //get app details from req body
    const { plan_mvp_name, plan_startdate, plan_enddate, plan_app_acronym } = req.body;

    //field check
    //no special char, <45 char, word or word+numeric
    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]{1,45}$/.test(plan_mvp_name)) return next(new ErrorHandler("plan_mvp_name is required and needs to be <45 char, no special char, word or word+numeric", 400, "ER_FIELD_INVALID"));
    if (!(plan_startdate && plan_enddate)) return next(new ErrorHandler("plan start date and/or end date is missing?", 400, "ER_FIELD_INVALID"));
    if (!plan_app_acronym) return next(new ErrorHandler("plan app acronym is somehow missing?? (plan is not tied to app)", 400, "ER_FIELD_INVALID"));

    //check permit to create plan, from application table column "app_permit_open"
    let [dataPermit, field1] = await connection.execute(`SELECT app_permit_open FROM applications  WHERE app_acronym= ? ;`, [plan_app_acronym]);
    //no app found so cant create plan for app
    if (dataPermit.length == 0) return next(new ErrorHandler(`No app found for ${plan_app_acronym}`, 400, "ER_FIELD_INVALID"));
    const permittedRole = dataPermit[0]["app_permit_open"];
    var authorized = await Checkgroup(req.user["username"], [permittedRole]);
    //if authorized =false means user not allowed
    if (!authorized) return next(new ErrorHandler(`Role(${req.user["groupname"]}) is not allowed to create new plan.`, 403, "ER_NOT_LOGIN"));

    //try to update data to database
    const [data, fields] = await connection.execute(`UPDATE plans SET plan_startdate = ? , plan_enddate = ? WHERE plan_mvp_name=? AND plan_app_acronym=? ;`, [plan_startdate, plan_enddate, plan_mvp_name, plan_app_acronym]);

    //check result of update
    if (data.affectedRows == 0) return next(new ErrorHandler(`No plan name called ${plan_mvp_name} for app name ${plan_app_acronym}`, 400, "ER_FIELD_INVALID"));
    console.log(data);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully edited plan",
    });
});
