import express from "express";
const route = express.Router();
import { cartControl } from "../controllers/cartController";
import { authorizeProfile } from "../middleware/authentication";

route.post('/:productId', authorizeProfile, cartControl.addToCart);
route.patch('/removeFromCart/:productId', authorizeProfile, cartControl.removeFromCart);
route.get('/downloadPDF', authorizeProfile, cartControl.PDFDownload);

export default route;