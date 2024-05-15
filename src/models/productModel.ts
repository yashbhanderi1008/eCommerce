import mongoose from 'mongoose';
import { productInterface } from '../constant/interface';


const productSchema = new mongoose.Schema<productInterface>({
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model<productInterface>('Product', productSchema);

export default Product 