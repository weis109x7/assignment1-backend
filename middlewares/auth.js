// import essentials
import jwt from "jsonwebtoken";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import connection from "../utils/database.js";
import checkGroup from "../utils/checkGroup.js";

//handle user authenthicating
export const isAuthenthicated = catchAsyncErrors(async (req, res, next) => {
    let token;
    console.log(req.originalUrl);
    console.log(req.body);
    //if token avaliable put it in token variable
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    //token not found return error
    if (!token) {
        return next(new ErrorHandler("Login first to access this resource.", 401));
    }

    //check token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //retrive user data with token userId
    const [data, fields] = await connection.execute(`SELECT userId,email,userGroup,isActive FROM accounts  WHERE userId= ? ;`, [decoded.id]);

    //check status of account
    if (data[0].isActive == "disabled") return next(new ErrorHandler("Unauthorized. Account disabled", 401));

    //token valid but user not found?? return error
    if (data.length == 0) return next(new ErrorHandler("JSON Web token is invalid. Try Again!", 500));

    data[0].token = token; //add token to user data
    //store user data in req.user for next middleware to use
    //req.user contains userId,email,userGroup,isActive and token
    req.user = data[0];

    next();
});

// handling users roles
export const isAuthorized = (...groups) => {
    return catchAsyncErrors(async (req, res, next) => {
        var authorized = await checkGroup(req.user["userId"], groups);
        //if authorized =false means user not allowed
        if (!authorized) {
            return next(new ErrorHandler(`Role(${req.user["userGroup"]}) is not allowed to access this resource.`, 403));
        }

        next();
    });
};
