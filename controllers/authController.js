//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import jwt from "jsonwebtoken";

//load config
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

//login api
export const login = catchAsyncErrors(async (req, res, next) => {
    //get userId and password from req body
    const { userId, password } = req.body;

    //error if null
    if (!userId || !password) {
        return next(new ErrorHandler("invalid credentials", 401));
    }

    //look in db for account and retrive passhash to compare
    const [data, fields] = await connection.execute(`SELECT * FROM accounts  WHERE userId=?;`, [userId]);
    //no user found
    if (data.length == 0) return next(new ErrorHandler("invalid credentials", 401));
    //check password match
    const passMatched = await bcrypt.compare(password, data[0]["password"]);
    //not matched return error
    if (!passMatched) return next(new ErrorHandler("invalid credentials", 401));
    //check status of account
    if (data[0].isActive == "disabled") return next(new ErrorHandler("invalid credentials", 401));

    // Create JWT Token with unique userId
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    //remove password from user data, add token to user data
    delete data[0].password;
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
