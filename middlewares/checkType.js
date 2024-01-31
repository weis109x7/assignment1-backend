// import essentials
import catchAsyncErrors from "./catchAsyncErrors.js";

//handle user authenthicating
export const checkType = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    for (const property in req.body) {
        console.log(`${property}: ${typeof req.body[property]}`);

        if (!(typeof req.body[property] == "string"))
            return res.status(200).json({
                code: "V2",
            });
    }

    next();
});
