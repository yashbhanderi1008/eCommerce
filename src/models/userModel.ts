import mongoose, { Document } from "mongoose";
import { userInterface } from "../constant/interface";

const userSchema = new mongoose.Schema<userInterface>({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model<userInterface>('User', userSchema);

export default User;