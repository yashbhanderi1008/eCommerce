import { Request, Response } from "express";
import { cartService } from "../services/cartService";
import { AuthenticatedRequest } from "../middleware/authentication";
import { Types } from "mongoose";

export class cartControl {
    static async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const productId: Types.ObjectId = new Types.ObjectId(req.params.productId);
            const quantity: number = req.body.quantity;
            const pId: string | undefined = (req as AuthenticatedRequest).pId
            const uId: string | undefined = (req as AuthenticatedRequest).uId

            if (pId !== undefined && uId !== undefined) {
                const cart = await cartService.addIntoCart(productId, quantity, pId, uId);
                res.status(200).json({ data: cart });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async removeFromCart(req: Request, res: Response): Promise<void> {
        try {
            const productId: Types.ObjectId = new Types.ObjectId(req.params.productId);
            const pId: string | undefined = (req as AuthenticatedRequest).pId
            const uId: string | undefined = (req as AuthenticatedRequest).uId

            if (pId !== undefined && uId !== undefined) {
                await cartService.removeItemFromCart(productId, pId, uId);

                res.status(200).json({ message: `${productId} is remove from cart successfully` });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async PDFDownload(req: Request, res: Response): Promise<void> {
        try {
            const pId: string | undefined = (req as AuthenticatedRequest).pId
            const uId: string | undefined = (req as AuthenticatedRequest).uId

            if (pId !== undefined && uId !== undefined) {
                await cartService.DownloadPDF(pId, uId);

                res.status(200).json({ message: `PDf downloaded` });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}