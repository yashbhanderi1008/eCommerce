import express from "express";
import { productControl } from "../controllers/productController";
const route = express.Router();

route.post('/addProduct', productControl.addProduct)
route.patch('/productUpdate/:productId', productControl.updateProduct)
route.delete('/productDelete/:productId', productControl.deleteProduct)

export default route;