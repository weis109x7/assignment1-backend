//import essentials
import express from "express";
import ErrorHandler from "./utils/errorHandler.js";

const app = express();

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down due to uncaught exception.");
    process.exit(1);
});

//load config
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

//setup body parser middleware
app.use(express.json());

//setup cookie-parser middleware
import cookieParser from "cookie-parser";
app.use(cookieParser());

//setup routes
import auth from "./routes/auth.js";
app.use("/api/v1", auth);

import user from "./routes/user.js";
app.use("/api/v1", user);

import group from "./routes/group.js";
app.use("/api/v1", group);

// Handle unhandled routes
app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//use error middleware
import { errorMiddleware } from "./middlewares/error.js";
app.use(errorMiddleware);

//start server
app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled promise rejection.");
    server.close(() => {
        process.exit(1);
    });
});
