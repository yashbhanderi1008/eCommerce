import express from "express";
import { authorizeProfile, authorizeUser } from "../middleware/authentication";
import { profileControl } from "../controllers/profileController";  
const route = express.Router();

route.post('/createProfile', authorizeUser, profileControl.createProfile)
route.get('/showProfile', authorizeUser, profileControl.showProfile)
route.get('/:profileId', authorizeUser, profileControl.switchProfile)
route.patch('/profileUpdate', authorizeProfile, profileControl.updateProfile)
route.delete('/profileDelete', authorizeProfile, profileControl.deleteProfile)

export default route;