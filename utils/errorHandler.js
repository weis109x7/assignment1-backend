//error handler class
export default class ErrorHandler extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode || "No Error Code";
        Error.captureStackTrace(this, this.constructor);
    }
}
