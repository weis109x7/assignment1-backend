//imporot essentials
import express from "express";

//import routes from controller
import { newUser,getUsers} from "../controllers/userController.js";
import { isAuthenthicated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();
//add routes

router.route('/user/new').post(newUser);
router.route('/user/getall').get(isAuthenthicated,isAuthorized("randorole","user","admin"), getUsers);


export default router;