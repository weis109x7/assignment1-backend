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
