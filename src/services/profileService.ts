import Profile from "../models/profileModel";
import jwt from "jsonwebtoken";
import { profileInterface } from "../constant/interface";
import { Types } from "mongoose";
import Cart from "../models/cartModel";

export class profileService {
    static async profileCreation(profileDetails: profileInterface, uId: string): Promise<profileInterface> {
        const profile = new Profile(profileDetails);

        profile.userId = new Types.ObjectId(uId);

        const newProfile = await profile.save();

        return newProfile;
    }

    static async profileList(uId: string): Promise<string[]> {
        const profiles: profileInterface[] = await Profile.find({ userId: uId });

        const profileNames: string[] = profiles.map(profile => profile.profileName);

        return profileNames;
    }

    static async profileSwitching(profileId: string, userId: string): Promise<{ token: string, profileName: string }> {
        const profile: profileInterface | null = await Profile.findOne({ _id: profileId, userId: userId })

        if (!profile) {
            throw new Error("Authorization Error");
        } else {
            const token = jwt.sign({ pId: profile._id!.toString(), uId: userId.toString() }, 'YashBhanderi', { algorithm: 'HS256' });

            const switchedProfile = {
                token: token,
                profileName: profile.profileName
            }

            return switchedProfile;
        }
    }

    static async profileUpdation(profileId: string, userId: string, editProfile: profileInterface): Promise<void> {
        let profile: profileInterface | null = await Profile.findOne({ _id: profileId, userId: userId })

        if (!profile) {
            throw new Error("Authorization Error");
        } else {
            profile = await Profile.findOneAndUpdate(profile._id, editProfile);

            await profile!.save();
        }
    }

    static async profileDeletion(profileId: string, userId: string): Promise<void> {
        const profile: profileInterface | null = await Profile.findOne({ _id: profileId, userId: userId })

        if (!profile) {
            throw new Error("Authorization Error");
        } else {
            await Cart.findOneAndDelete({ profileId: profileId })

            await Profile.findOneAndDelete(profile._id);
        }
    }
}
