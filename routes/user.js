//imporot essentials
import express from "express";
const router = express.Router();

//import routes from controller
import { newUser,getUsers, editUser} from "../controllers/userController.js";
//import authenthication middleware
import { isAuthenthicated, isAuthorized } from "../middlewares/auth.js";

//add middleware authenthication and authorization
router.use(isAuthenthicated,isAuthorized("admin"));
//add routes with middlewares
router.route('/user/new').post(newUser);
router.route('/user/edit').post(editUser);
router.route('/user/getall').get(getUsers);

export default router;