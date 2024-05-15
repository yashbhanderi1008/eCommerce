import express from 'express';
import dotenv from 'dotenv';
import connectDb from './src/db/connection';
import userRoute from './src/routes/userRoute';
import profileRoute from './src/routes/profileRoute';
import productRoute from './src/routes/productRoute';
import cartRoute from './src/routes/cartRoute';

dotenv.config();
const app = express();
app.use(express.json());
connectDb();

app.use('/user', userRoute);
app.use('/user/profile', profileRoute);
app.use('/admin', productRoute);
app.use('/user/profile/cart', cartRoute);

const port: Number = parseInt(process.env.PORT!);

app.listen(port, () => {
    console.log(`Server is running on ${port}`) 
})