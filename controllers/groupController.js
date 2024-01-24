//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//load config
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

//create new group api
export const newGroup = catchAsyncErrors(async (req, res, next) => {
    //get groupname from body
    const { groupName } = req.body;

    //error if null
    if (!groupName) {
        return next(new ErrorHandler("empty field", 400));
    }

    if (!groupnameChecker(groupName)) {
        return next(new ErrorHandler("Groupname must not contain special characters, only contain letters or letters and numbers and must be <45 char ", 400, "ER_CHAR_INVALID"));
    }

    //try to insert data to database
    const [data, fields] = await connection.execute(`INSERT INTO groupnamelist VALUES (?);`, [groupName]);

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success: true,
        message: "Sucessfully created group",
    });
});

//get all group names
export const getGroups = catchAsyncErrors(async (req, res, next) => {
    //get all group names in database
    const [data, fields] = await connection.execute(`SELECT groupname FROM groupnamelist;`);

    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        success: true,
        message: data,
    });
});

//reges checker function to make sure input fufils requirement
function groupnameChecker(groupname) {
    //regex matches <=45 char with no special character, word or word+digits
    const regex = new RegExp(/^[a-zA-Z][a-zA-Z0-9]{0,44}$/);
    return regex.test(groupname);
}
