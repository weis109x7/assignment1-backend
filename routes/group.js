//imporot essentials
import express from "express";
const router = express.Router();

//import routes from controller
import { getGroups, newGroup } from "../controllers/groupController.js";
//import authenthication middleware
import { isAuthenthicated, isAuthorized } from "../middlewares/auth.js";

//add middleware authenthication and authorization
router.use(isAuthenthicated,isAuthorized("admin"));
//add routes with middlewares
router.route('/group/new').post(newGroup);
router.route('/group/getgroups').get(getGroups);


export default router;