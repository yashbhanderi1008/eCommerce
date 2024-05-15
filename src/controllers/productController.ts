import { Request, Response } from "express";
import { productInterface } from "../constant/interface";
import { productService } from "../services/productService";
import { Types } from "mongoose";

export class productControl {
    static async addProduct(req: Request, res: Response): Promise<void> {
        try {
            const product: productInterface = req.body

            const newProduct = await productService.newProduct(product);

            res.status(200).json({ data: newProduct });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const product: productInterface = req.body;
            const productId: Types.ObjectId = new Types.ObjectId(req.params.productId);

            await productService.productUpdation(product, productId);

            res.status(200).json({ message: "Product updated successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteProduct(req:Request, res:Response): Promise<void>{
        try {
            const productId: string = req.params.productId

            await  productService.productDeletion(productId);

            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}