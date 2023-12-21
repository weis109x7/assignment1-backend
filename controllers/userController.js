//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//newUser api
export const newUser = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    var { userId, password, email, userGroup, isActive } = req.body;

    if (!email) email = null; //if email is blank set value to null
    if (!(isActive === "active")) isActive = "disabled"; //if isActive is not active set to disabled

    //throw error if required terms is null
    if (!userId || !password) {
        return next(new ErrorHandler("empty username/password fields", 400));
    }

    //throw error if password requirements not fufiled
    if (!passwordChecker(password)) {
        return next(new ErrorHandler("password needs to be 8-10char and contains alphanumeric and specialcharacter", 400));
    }

    //hash password with bcrypt
    const hashedpassword = await bcrypt.hash(password, 10);

    //try to insert data to database
    const [data, fields] = await connection.execute(`INSERT INTO accounts VALUES (?,?,?,?,?);`, [userId, hashedpassword, email, userGroup, isActive]);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//editUser api
export const editUser = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    var { userId, password, email, userGroup, isActive } = req.body;

    if (!email) email = null; //if email is blank set value to null
    if (!(isActive === "active")) isActive = "disabled"; //if isActive is not active set to disabled

    //if password provided
    if (password) {
        //throw error if password requirements not fufiled
        if (!passwordChecker(password)) {
            return next(new ErrorHandler("password needs to be 8-10char and contains alphanumeric and specialcharacter", 400));
        }
        //hash password with bcrypt
        password = await bcrypt.hash(password, 10);
    } else {
        //no password provided means user dosent want to change password, set to null
        password = null;
    }

    //try to edit data of database
    const [data, fields] = await connection.execute(
        //if password==null then use old password database value, if email==null then set null in database
        `UPDATE accounts SET email = ? ,userGroup = ?, isActive = ? ,password= COALESCE(?,password) WHERE userId=?;`,
        [email, userGroup, isActive, password, userId]
    );

    //return success message when success
    //catch async error will throw error if query fails,
    //no error if invalid userId???
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//updateprofile for self api
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    const userId = req.user["userId"];
    var { password, email } = req.body;

    if (!email) email = null; //if email is blank set value to null

    //if password provided
    if (password) {
        //throw error if password requirements not fufiled
        if (!passwordChecker(password)) {
            return next(new ErrorHandler("password needs to be 8-10char and contains alphanumeric and specialcharacter", 400));
        }
        //hash password with bcrypt
        password = await bcrypt.hash(password, 10);
    } else {
        //no password provided means user dosent want to change password, set to null
        password = null;
    }

    //try to edit data of database
    const [data, fields] = await connection.execute(
        //if password==null then use old password database value, if email==null then set null in database
        `UPDATE accounts SET email = ?,password= COALESCE(?,password) WHERE userId=?;`,
        [email, password, userId]
    );

    //return success message when success
    //catch async error will throw error if query fails,
    //no error if invalid userId???
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//get all users
export const getUsers = catchAsyncErrors(async (req, res, next) => {
    //get all users in database
    const [data, fields] = await connection.execute(`SELECT userId,email,userGroup,isActive FROM accounts;`);

    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//password checker function to make sure password fufils requirement
function passwordChecker(password) {
    //regex matches 8-10 char with alphanumeric with special character
    const regex = new RegExp(/^(?=.*[A-Za-z0-9])(?=.*[^A-Za-z0-9]).{8,10}$/);
    return regex.test(password);
}
