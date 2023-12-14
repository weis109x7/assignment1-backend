//imporot essentials
import express from "express";
const router = express.Router();

//import routes from controller
import { newUser, getUsers, editUser, updateProfile } from "../controllers/userController.js";
//import authenthication middleware
import { isAuthenthicated, isAuthorized } from "../middlewares/auth.js";

//add middleware authenthication and authorization
router.use(isAuthenthicated);
//add routes with middlewares
router.route("/user/new").post(isAuthorized("admin"), newUser);
router.route("/user/edit").post(isAuthorized("admin"), editUser);
router.route("/user/getusers").get(isAuthorized("admin"), getUsers);
router.route("/user/update").post(updateProfile);

export default router;
