import mongoose from "mongoose";
import { cartInterface } from "../constant/interface";

const cartSchema = new mongoose.Schema<cartInterface>({
    itemCollection:[{
        productId: {
            type: mongoose.Schema.Types.ObjectId
        },
        quantity: {
            type: Number
        }
    }],
    profileId: {
        type: mongoose.Schema.Types.ObjectId
    }
})

const Cart = mongoose.model<cartInterface>('Cart', cartSchema);

export default Cart;