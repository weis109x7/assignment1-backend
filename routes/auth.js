//imporot essentials
import express from "express";

//import routes from controller
import { getLogin } from "../controllers/authController.js";

const router = express.Router();
//add routes

router.route('/login').post(getLogin);

export default router;