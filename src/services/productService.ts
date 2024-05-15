import Product from "../models/productModel";
import { productInterface } from "../constant/interface";
import { Types } from "mongoose";

export class productService {
    static async newProduct(productDetails: productInterface): Promise<productInterface> {
        const product = new Product(productDetails);

        const newProduct = await product.save();

        return newProduct;
    }

    static async productUpdation(productDetails: productInterface, productID: Types.ObjectId): Promise<void> {
        const product: productInterface | null = await Product.findOneAndUpdate(productID, productDetails);
        console.log(product)

        if (!product) {
            throw new Error("Product is not listed");
        } else {
            await product.save();
        }
    }

    static async productDeletion(productID: string): Promise<void> {
        await Product.findByIdAndDelete(productID)
    }
}