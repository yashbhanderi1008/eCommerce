import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}${process.env.MONGODB_NAME}`)
        console.log("Database connected")
    } catch (error) {
        process.exit(1)
    }
}

export default connectDb