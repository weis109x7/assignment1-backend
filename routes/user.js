//imporot essentials
import express from "express";
const router = express.Router();

//import routes from controller
import { newUser,getUsers} from "../controllers/userController.js";
//import authenthication middleware
import { isAuthenthicated, isAuthorized } from "../middlewares/auth.js";

//add routes with middlewares
router.route('/user/new').post(newUser);
router.route('/user/getall').get(isAuthenthicated,isAuthorized("randorole","user","admin"), getUsers);

export default router;