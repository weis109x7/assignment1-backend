
//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from 'bcryptjs'
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const newUser = catchAsyncErrors(async (req, res, next) => {
    const {userId,password,email,userGroup,isActive} = req.body;
    //throw error if null
    if(!userId || !password) {
        return next(new ErrorHandler("empty username/password fields",400));
    }
    
    const hashedpassword = await bcrypt.hash(password, 10);

    const [data,fields] = await connection.execute(`INSERT INTO accounts VALUES (
                                                    "${userId}",
                                                    "${hashedpassword}",
                                                    ${email?('"'+email+'"'):"NULL"},
                                                    ${userGroup?('"'+userGroup+'"'):"NULL"},
                                                    "${isActive ?? "active"}");`
                                                ) // if email/userGroup is blank, replace it with NULL else add " " to beginning and end

    return res.status(200).json({
        success : true,
        message : data
    });
});

export const getUsers = catchAsyncErrors(async (req, res, next) => {
    //get all users in database
    const [data,fields] = await connection.execute(`SELECT * FROM accounts;`);

    return res.status(200).json({
        success : true,
        message : data
    });
});