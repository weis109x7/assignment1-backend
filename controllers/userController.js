//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//newUser api
export const newUser = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    var { username, password, email, groupname, isactive } = req.body;

    if (!email) email = null; //if email is blank set value to null
    if (!(isactive === "disabled")) isactive = "active"; //if isactive is not specified as disabled, set to active

    //throw error if required terms is null
    if (!username || !password) {
        return next(new ErrorHandler("empty username/password fields", 400));
    }

    //throw error if password requirements not fufiled
    if (!passwordChecker(password)) {
        return next(new ErrorHandler("password needs to be 8-10char and contains alphanumeric and specialcharacter", 400, "ER_PW_INVALID"));
    }
    //throw error if password requirements not fufiled
    if (!usernameChecker(username)) {
        return next(new ErrorHandler("Username needs to be word or word+digits with <=45 char with no special character", 400, "ER_PW_INVALID"));
    }

    //hash password with bcrypt
    const hashedpassword = await bcrypt.hash(password, 10);

    //try to insert data to database
    const [data, fields] = await connection.execute(`INSERT INTO accounts VALUES (?,?,?,?,?);`, [username, hashedpassword, email, groupname, isactive]);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully created user",
    });
});

//editUser api
export const editUser = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    var { username, password, email, groupname, isactive } = req.body;

    if (!email) email = null; //if email is blank set value to null
    if (!(isactive === "active")) isactive = "disabled"; //if isactive is not active set to disabled

    if (isactive == "disabled" && username == "admin") return next(new ErrorHandler("cant disable admin", 400, "ER_FIELD_INVALID"));

    if (username == "admin" && !groupname.split(",").includes("admin")) return next(new ErrorHandler("cant remove admin, admin rights", 400, "ER_FIELD_INVALID"));

    //if password provided
    if (password) {
        //throw error if password requirements not fufiled
        if (!passwordChecker(password)) {
            return next(new ErrorHandler("password needs to be 8-10char and contains alphanumeric and specialcharacter", 400, "ER_PW_INVALID"));
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
        `UPDATE accounts SET email = ? ,groupname = ?, isactive = ? ,password= COALESCE(?,password) WHERE username=?;`,
        [email, groupname, isactive, password, username]
    );

    //check result of update
    if (data.affectedRows == 0) return next(new ErrorHandler(`No Username called ${username}`, 400, "ER_FIELD_INVALID"));

    //return success message when success
    //catch async error will throw error if query fails,
    //no error if invalid username???
    return res.status(200).json({
        success: true,
        message: "Sucessfully edited user",
    });
});

//updateprofile for self api
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    //get user details from req body
    const username = req.user["username"];
    var { password, email } = req.body;

    if (!email) email = null; //if email is blank set value to null

    //if password provided
    if (password) {
        //throw error if password requirements not fufiled
        if (!passwordChecker(password)) {
            return next(new ErrorHandler("password needs to be 8-10char and contains alphanumeric and specialcharacter", 400, "ER_PW_INVALID"));
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
        `UPDATE accounts SET email = ?,password= COALESCE(?,password) WHERE username=?;`,
        [email, password, username]
    );

    //check result of update
    if (data.affectedRows == 0) return next(new ErrorHandler(`No Username called ${username}`, 400, "ER_FIELD_INVALID"));

    //return success message when success
    //catch async error will throw error if query fails,
    //no error if invalid username???
    return res.status(200).json({
        success: true,
        message: "sucessfully updated own profile",
        user: req.user,
    });
});

//get all users
export const getUsers = catchAsyncErrors(async (req, res, next) => {
    //get all users in database
    const [data, fields] = await connection.execute(`SELECT username,email,groupname,isactive FROM accounts;`);
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

//reges checker function to make sure input fufils requirement
function usernameChecker(input) {
    //regex matches <=45 char with no special character, word or word+digits
    const regex = new RegExp(/^[a-zA-Z][a-zA-Z0-9]{0,44}$/);
    return regex.test(input);
}
