import mongoose, { Types } from "mongoose";
import { profileInterface } from "../constant/interface";

const profileSchema = new mongoose.Schema<profileInterface>({
    profileName: {
        type: String,
        required: true
    },
    relationToUser: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Profile = mongoose.model<profileInterface>('Profile', profileSchema);

export default Profile