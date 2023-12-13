//imporot essentials
import express from "express";
const router = express.Router();

//import routes from controller
import { getLogin } from "../controllers/authController.js";

//add routes
router.route('/login').post(getLogin);

export default router;