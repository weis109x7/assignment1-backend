import jwt from "jsonwebtoken";

// Create and send token and save in cookie
export const sendToken = (userId, statusCode, res) => {
    // Create JWT Token with unique userId
    const token = jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    });

    // Options for cookie
    const options = {
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRES_DAY * 24*60*60*1000),
        httpOnly : true
    };

    // if(process.env.NODE_ENV === 'production ') {
    //     options.secure = true;
    // }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success : true,
            token
        });
    
}