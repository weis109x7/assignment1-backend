import jwt from "jsonwebtoken";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import connection from "../utils/database.js";

//handle user authenthicating
export const isAuthenthicated = catchAsyncErrors(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [data,fields] = await connection.execute(`SELECT * FROM accounts  WHERE userId="${decoded.id}";`);
    if (data.length==0) return next(new ErrorHandler("JSON Web token is invalid. Try Again!",500));

    req.user = data[0];

    next();
});

// handling users roles
export const isAuthorized = (...groups) => {
    return (req, res, next) => {
        const userGroup = req.user["userGroup"].split(",")
        const authorizedGroup = groups.filter(value => userGroup.includes(value));

        if(!authorizedGroup) {
            return next(new ErrorHandler(`Role(${req.user["userGroup"]}) is not allowed to access this resource.`, 403))
        }
        next();
    }
}
