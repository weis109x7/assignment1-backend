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

// //setup cors midleware
// import cors from "cors";
// var corsOptions = {
//     origin: "http://localhost:3000",
//     optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

//setup body parser middleware
app.use(express.json());

app.use(function (req, res, next) {
    try {
        decodeURIComponent(req.path);
    } catch (e) {
        return res.status(400).json({
            code: "V1",
        });
    }
    next();
});

//import routes from tasks controller
import { GetTaskbyState, CreateTask, PromoteTask2Done } from "./controllers/taskController.js";
import { checkType } from "./middlewares/checkType.js";

//add routes with middlewares
app.post("/GetTaskbyState", checkType, GetTaskbyState);
app.post("/CreateTask", checkType, CreateTask); //auth done in route level
app.post("/PromoteTask2Done", checkType, PromoteTask2Done); //auth done in route level

// Handle unhandled routes
app.all("*", (req, res, next) => {
    return res.status(400).json({
        code: "V1",
    });
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
