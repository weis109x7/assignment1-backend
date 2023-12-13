
//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from 'bcryptjs'
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//newUser api logic
export const newUser = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    const {userId,password,email,userGroup,isActive} = req.body;

    //throw error if required terms is null
    if(!userId || !password) {
        return next(new ErrorHandler("empty username/password fields",400));
    }
    
    //hash password with bcrypt
    const hashedpassword = await bcrypt.hash(password, 10);

    //try to insert data to database
    const [data,fields] = await connection.execute(`INSERT INTO accounts VALUES (
                                                    "${userId}",
                                                    "${hashedpassword}",
                                                    ${email?('"'+email+'"'):"NULL"},
                                                    ${userGroup?('"'+userGroup+'"'):"NULL"},
                                                    "${isActive ?? "active"}");`
                                                ) // if email/userGroup is blank, replace it with NULL else return email/userGroup
                                                //if isActive not provided default to active

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success : true,
        message : data
    });
});

//get user api logic
export const getUsers = catchAsyncErrors(async (req, res, next) => {
    //get all users in database
    const [data,fields] = await connection.execute(`SELECT * FROM accounts;`);

    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        success : true,
        message : data
    });
});