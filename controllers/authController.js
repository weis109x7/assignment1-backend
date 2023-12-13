
//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from 'bcryptjs'
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/jwtToken.js";

//load config
import dotenv from 'dotenv';
dotenv.config({path:'./config/config.env'})


export const getLogin = catchAsyncErrors(async (req, res, next) => {
    const { userId, password } = req.body;
    
    //error if null
    if(!userId || !password) {
        return next(new ErrorHandler("empty username/password",400));
    }

    //look in db for account and retrive passhash to compare
    const [data,fields] = await connection.execute(`SELECT password FROM accounts  WHERE userId="${userId}";`);
    //no user found
    if (data.length==0) return next(new ErrorHandler("invalid credentials",401));
    //check password match
    const passMatched = await bcrypt.compare(password, data[0]["password"]);
    //not matched return error
    if (!passMatched) return next(new ErrorHandler("invalid credentials",401));

    sendToken(userId,200,res);
})