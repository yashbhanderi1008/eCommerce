import { jsPDF } from "jspdf";
import Cart from "../models/cartModel";
import { type cartInterface, profileInterface, itemCollectionInterface, userInterface, productInterface } from "../constant/interface";
import Profile from "../models/profileModel";
import { Types } from "mongoose";
import fs from 'fs';
import User from "../models/userModel";
import Product from "../models/productModel";

export class cartService {
    static async addIntoCart(productId: Types.ObjectId, quantity: number, profileId: string, userId: string): Promise<cartInterface> {
        let cart: cartInterface | null = await Cart.findOne({ profileId: profileId });

        const profile: profileInterface | null = await Profile.findOne({ _id: profileId });

        if (profile && (profileId != profile._id?.toString() || userId != profile.userId.toString())) {
            throw new Error("Authorization Error!!");
        }

        if (!cart) {
            cart = new Cart();

            cart.itemCollection.push({ productId, quantity });

            cart.profileId = new Types.ObjectId(profileId);

            const newCart = await cart.save();

            return newCart;
        } else {
            const product: itemCollectionInterface | undefined = cart.itemCollection.find((item) => item.productId.toString() == productId.toString());

            if (product) {
                product.quantity = quantity;
            } else {
                cart.itemCollection.push({ productId, quantity });
            }

            const existCart = await cart.save();

            return existCart;
        }
    }

    static async removeItemFromCart(productId: Types.ObjectId, profileId: string, userId: string): Promise<void> {
        let cart: cartInterface | null = await Cart.findOne({ profileId: profileId });

        const profile: profileInterface | null = await Profile.findOne({ _id: profileId });

        if (profile && (profileId != profile._id?.toString() || userId != profile.userId.toString())) {
            throw new Error("Authorization Error!!");
        }

        if (!cart) {
            throw new Error("Cart not found");
        } else {
            const product = cart.itemCollection.findIndex((item) => item.productId.toString() == productId.toString());

            if (product != -1) {
                cart.itemCollection.splice(product, 1);

                await cart.save();
            } else {
                throw new Error(`${productId} is not in cart`);
            }
        }
    }

    static async DownloadPDF(profileId: string, userId: string): Promise<void> {
        const profile: profileInterface | null = await Profile.findOne({ _id: profileId, userId: userId })
        const user: userInterface | null = await User.findOne({ _id: userId })
        const cart: cartInterface | null = await Cart.findOne({ profileId: profileId })
       
        if (!profile || !user || !cart) {
            throw new Error("Authorization Error!!");
        } else {
            const doc = new jsPDF();

            // Add user details
            doc.text('User Details:', 10, 10);
            doc.text(`Name: ${user?.userName}`, 10, 20);
            doc.text('', 10, 30);

            // Add profile details
            doc.text('Profile Details:', 10, 40);
            doc.text(`Username: ${profile.profileName}`, 10, 50);
            doc.text(`Relation to User: ${profile.relationToUser}`, 10, 60);
            doc.text('', 10, 70);

            doc.text('Cart:', 10, 80);

            const columnWidth = 40;
            const totalWidth = columnWidth * 4;
            const startX = 10;
            let startY = 110;

            // Add table headers
            const headers = ['Product', 'Quantity', 'Price', 'Total'];
            // doc.setFontStyle('bold');
            headers.forEach((header, index) => {
                doc.text(header, startX + (index * columnWidth), startY);
            });

            // Draw horizontal line under headers
            doc.line(startX, startY + 5, startX + totalWidth, startY + 5);

            // Add cart items to the table
            cart.itemCollection.forEach(async (item, rowIndex) => {
                const product = await Product.findById(item.productId);
                console.log(product)
                if (product) {
                    const productName = product.productName;
                    const quantity = item.quantity.toString(); // Convert to string
                    const price = product.price.toString(); // Convert to string
                    const totalPrice = (item.quantity * product.price).toString(); // Convert to string
                    const rowData = [productName, quantity, price, totalPrice];
                    startY += 10;
                    rowData.forEach((cell, cellIndex) => {
                        doc.text(cell, startX + (cellIndex * columnWidth), startY);
                    });
                }
            });

            // Save PDF to a file
            const filename = `${profile.profileName}_cart.pdf`;
            doc.save(filename);
        }
    }
}