//imporot essentials
import express from "express";

//import routes from controller
import { newUser,getUsers} from "../controllers/userController.js";

const router = express.Router();
//add routes

router.route('/user/new').post(newUser);
router.route('/user/getall').get(getUsers);


export default router;