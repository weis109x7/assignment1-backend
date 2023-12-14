
//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from 'bcryptjs'
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//newUser api
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
    const [data,fields] = await connection.execute(`INSERT INTO accounts VALUES ("${userId}",
                                                    "${hashedpassword}",
                                                    ${email?('"'+email+'"'):"NULL"},
                                                    "${userGroup??""}",
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

//editUser api
export const editUser = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    const {userId,password,email,userGroup,isActive} = req.body;

    //build query, if email not provided set back to NULL
    var query=
    `email = ${email?('"'+email+'"'):"NULL"},
    userGroup = "${userGroup}",
    isActive = "${isActive}"`;

    //hash password with bcrypt if password provided
    const hashedpassword = password ? await bcrypt.hash(password, 10) : undefined ;
    //if password provided append hashed password to query else wont update password
    if (password) query+=`,password="${hashedpassword}"`;

    //try to edit data of database
    const [data,fields] = await connection.execute(`UPDATE accounts
                                                    SET ${query}
                                                    WHERE userId="${userId}";`
                                                ) 

    //return success message when success
    //catch async error will throw error if query fails,
    //no error if invalid userId???
    return res.status(200).json({
        success : true,
        message : data
    });
});

//updateprofile for self api
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    const userId = req.user["userId"];
    const {password,email} = req.body;

    //build query, if email not provided set back to NULL
    var query=
    `email = ${email?('"'+email+'"'):"NULL"}`;

    //hash password with bcrypt if password provided
    const hashedpassword = password ? await bcrypt.hash(password, 10) : undefined ;
    //if password provided append hashed password to query else wont update password
    if (password) query+=`,password="${hashedpassword}"`;

    //try to edit data of database
    const [data,fields] = await connection.execute(`UPDATE accounts
                                                    SET ${query}
                                                    WHERE userId="${userId}";`
                                                ) 

    //return success message when success
    //catch async error will throw error if query fails,
    //no error if invalid userId???
    return res.status(200).json({
        success : true,
        message : data
    });
});

//get all users 
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