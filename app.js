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

//setup cors midleware
import cors from "cors";
var corsOptions = {
    origin: "http://localhost:3002",
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//setup body parser middleware
app.use(express.json());

//import routes from tasks controller
import { GetTaskbyState, CreateTask, PromoteTask2Done } from "./controllers/taskController.js";
//add routes with middlewares
app.post("/GetTaskbyState", GetTaskbyState);
app.post("/CreateTask", CreateTask); //auth done in route level
app.post("/PromoteTask2Done", PromoteTask2Done); //auth done in route level

// Handle unhandled routes
app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 200, "E404"));
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
