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
app.use(cors());

//setup body parser middleware
app.use(express.json());

//import essential middlewares for routes
import { isAuthenthicated, isAuthorized } from "./middlewares/auth.js";

//import routes from auth controller
import { login, logout } from "./controllers/authController.js";
//add routes with middleware
app.post("/api/v1/login", login);
app.post("/api/v1/logout", isAuthenthicated, logout);

//import routes from user controller
import { newUser, getUsers, editUser, updateProfile } from "./controllers/userController.js";
//add routes with middlewares
app.post("/api/v1/user/new", isAuthenthicated, isAuthorized("admin"), newUser);
app.post("/api/v1/user/edit", isAuthenthicated, isAuthorized("admin"), editUser);
app.post("/api/v1/user/getusers", isAuthenthicated, isAuthorized("admin"), getUsers);
app.post("/api/v1/user/update", isAuthenthicated, updateProfile);

//import routes from group controller
import { getGroups, newGroup } from "./controllers/groupController.js";
//add routes with middlewares
app.post("/api/v1/group/new", isAuthenthicated, isAuthorized("admin"), newGroup);
app.post("/api/v1/group/getgroups", isAuthenthicated, isAuthorized("admin"), getGroups);

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
