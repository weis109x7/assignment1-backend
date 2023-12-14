
//import essentials
import connection from "../utils/database.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//load config
import dotenv from 'dotenv';
dotenv.config({path:'./config/config.env'})

//create new group api
export const newGroup = catchAsyncErrors(async (req, res, next) => {
    //get userId and password from req body
    const { groupName } = req.body;
    
    //error if null
    if(!groupName) {
        return next(new ErrorHandler("empty field",400));
    }

    //try to insert data to database
    const [data,fields] = await connection.execute(`INSERT INTO roles VALUES ("${groupName}");`)

    //return success message when success
    //catch async error will throw error if insert failed
    return res.status(200).json({
        success : true,
        message : data
    });
})

//get all group names 
export const getGroups = catchAsyncErrors(async (req, res, next) => {
    //get all group names in database
    const [data,fields] = await connection.execute(`SELECT userGroup FROM roles;`);

    //return success message when success
    //catch async error will throw error if query failed
    return res.status(200).json({
        success : true,
        message : data
    });
});