import  express  from "express";
const route = express.Router();
import { userControl } from "../controllers/userController";
import { authorizeUser } from "../middleware/authentication";

route.post('/signUp', userControl.signUpUser);
route.post('/login', userControl.loginUser);
route.patch('/userUpdate', authorizeUser, userControl.updateUser);
route.delete('/userDelete', authorizeUser, userControl.deleteUser);

export default route;