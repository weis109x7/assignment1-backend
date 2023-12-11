import express from "express";
import { getLogin,getUser } from "../controllers/authController.js";
const router = express.Router();

router.route('/login').post(getLogin);
router.route('/user').get(getUser);

export default router;