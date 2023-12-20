import jwt from "jsonwebtoken";

// Create and send token and save in cookie
export const sendToken = (userId, statusCode, res) => {
    // Create JWT Token with unique userId
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    // if(process.env.NODE_ENV === 'production ') {
    //     options.secure = true;
    // }

    //return token as response
    res.status(statusCode).json({
        success: true,
        token,
    });
};
