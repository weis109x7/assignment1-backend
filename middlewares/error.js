//import essentials
import ErrorHandler from "../utils/errorHandler.js";

export function errorMiddleware(err, req, res, next) {
    err.statusCode = err.statusCode || 500;

    //dev error message show stacktrace for everything
    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack,
        });
    }

    //prod error message show generic error msg
    if (process.env.NODE_ENV === "production ") {
        let error = { ...err };

        error.message = err.message;
        // Handle duplicate key error
        if (err.code === "ENOTFOUND") {
            const message = "Could not connect to database.";
            error = new ErrorHandler(message, 500);
        }

        // Handling Wrong JWT token error
        if (err.name === "JsonWebTokenError") {
            const message = "JSON Web token is invalid. Try Again!";
            error = new ErrorHandler(message, 500);
        }

        // Handling Expired JWT token error
        if (err.name === "TokenExpiredError") {
            const message = "JSON Web token is expired. Try Again!";
            error = new ErrorHandler(message, 500);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error.",
        });
    }
}
