//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import { Checkgroup } from "../middlewares/auth.js";

//load config
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

//login api
export const login = catchAsyncErrors(async (req, res, next) => {
    //get username and password from req body
    const { username, password } = req.body;

    //error if null
    if (!username || !password) {
        return next(new ErrorHandler("invalid credentials", 401, "ER_INVALID_CREDEN"));
    }

    //look in db for account and retrive passhash to compare
    const [data, fields] = await connection.execute(`SELECT username,password,email,groupname,isactive FROM accounts  WHERE username=?;`, [username]);
    //no user found
    if (data.length == 0) return next(new ErrorHandler("invalid credentials", 401, "ER_INVALID_CREDEN"));
    //check password match
    const passMatched = await bcrypt.compare(password, data[0]["password"]);
    //not matched return error
    if (!passMatched) return next(new ErrorHandler("invalid credentials", 401, "ER_INVALID_CREDEN"));
    //check status of account
    if (data[0].isactive == "disabled") return next(new ErrorHandler("invalid credentials", 401, "ER_INVALID_CREDEN"));

    // Create JWT Token with unique username
    const token = jwt.sign({ id: username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    //remove password from user data, add token to user data
    delete data[0].password;
    //convert groupname from comma seperated to array
    data[0]["groupname"] = data[0]["groupname"] ? data[0]["groupname"].split(",") : [];
    data[0].token = token;

    //return token and user data(w/o password) as response
    res.status(200).json({
        success: true,
        user: data[0],
    });
});

export const checkToken = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export const checkGroup = catchAsyncErrors(async (req, res, next) => {
    const gorupToCheck = req.body.group;

    const checkGroupResult = await Checkgroup(req.user["username"], [gorupToCheck]);
    if (checkGroupResult) {
        res.status(200).json({
            success: true,
            message: `${req.user["username"]} is part of ${gorupToCheck} group`,
        });
    } else {
        return next(new ErrorHandler(`Role(${req.user["groupname"]}) is not part of ${gorupToCheck} group.`, 403, "ER_NOT_ALLOWED"));
    }
});

export const checkAppPermit = catchAsyncErrors(async (req, res, next) => {
    const appName = req.body.appName;
    const perms_state = req.body.perms_state;
    var query = "";
    switch (perms_state) {
        case "create":
            query = `SELECT app_permit_create FROM applications  WHERE app_acronym= ? ;`;
            break;
        case "open":
            query = `SELECT app_permit_open FROM applications  WHERE app_acronym= ? ;`;
            break;
        case "todo":
            query = `SELECT app_permit_todolist FROM applications  WHERE app_acronym= ? ;`;
            break;
        case "doing":
            query = `SELECT app_permit_doing FROM applications  WHERE app_acronym= ? ;`;
            break;
        case "done":
            query = `SELECT app_permit_done FROM applications  WHERE app_acronym= ? ;`;
            break;
        case "closed":
            return res.status(200).json({
                success: false,
                message: "cant act on closed state",
            });
        default:
            return next(new ErrorHandler(`invalid task state???`, 400, "ER_FIELD_INVALID"));
    }

    //check permit to act on task with state, from application table column "app_permit_?"
    let [dataPermit, field1] = await connection.execute(query, [appName]);
    if (dataPermit.length == 0) return next(new ErrorHandler(`invalid app name???`, 400, "ER_FIELD_INVALID"));
    const permittedRole = Object.values(dataPermit[0])[0];

    const gorupToCheck = permittedRole;
    const checkGroupResult = await Checkgroup(req.user["username"], [gorupToCheck]);
    if (checkGroupResult) {
        res.status(200).json({
            success: true,
            message: `${req.user["username"]} is part of ${gorupToCheck} group`,
        });
    } else {
        return res.status(403).json({
            success: false,
            errorCode: "ER_NOT_ALLOWED",
            message: `Role(${req.user["groupname"]}) is not part of ${gorupToCheck} group.`,
        });
    }
});

// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
    //set cookie to none
    res.cookie("token", "none", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
});
