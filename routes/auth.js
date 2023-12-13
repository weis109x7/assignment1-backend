//imporot essentials
import express from "express";
const router = express.Router();

//import routes from controller
import { login, logout } from "../controllers/authController.js";

//add routes
router.route('/login').post(login);
router.route('/logout').post(logout);

export default router;