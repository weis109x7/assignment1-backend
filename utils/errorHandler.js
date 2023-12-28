//error handler class
export default class ErrorHandler extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code || "No Error Code";
        Error.captureStackTrace(this, this.constructor);
    }
}
