import User from "../models/userModel";
import { profileInterface, userInterface } from "../constant/interface";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Profile from "../models/profileModel";
import Cart from "../models/cartModel";
import { Types } from "mongoose";

export class userServise {
    static async signUp(userDetails: userInterface): Promise<void> {
        if (await User.findOne({ userName: userDetails.userName })) {
            throw new Error("User already exists");
        }

        userDetails.password = await bcrypt.hash(userDetails.password, 10);

        const newUser = new User(userDetails);

        await newUser.save();
    }

    static async login(userDetails: userInterface): Promise<String> {

        const user: userInterface | null = await User.findOne({ userName: userDetails.userName });

        if (!user) {
            throw new Error("User doesn't exists");
        }

        const isPassword = await bcrypt.compare(userDetails.password, user.password);

        if (isPassword) {
            const token = jwt.sign({ uId: user._id!.toString() }, 'YashBhanderi', { algorithm: 'HS256' });

            return token;
        } else {
            throw new Error("Wrong credemtials");
        }
    }

    static async updateDetails(userDetails: userInterface, userId: string): Promise<void> {
        userDetails.password = await bcrypt.hash(userDetails.password, 10);

        const user: userInterface | null = await User.findByIdAndUpdate(userId, userDetails);

        if (!user) {
            throw new Error("User not found");
        } else {
            await user.save();
        }
    }

    static async deleteDetails(userId: string): Promise<void> {
        // const profiles: profileInterface[] = await Profile.find({ userId: userId });

        // const profileIds: string[] = profiles.map(profile => profile._id!.toString());

        // const carts = await Promise.all(profileIds.map(async profileId => {
        //     return await Cart.findOne({ profileId: profileId });
        // }));

        // const cartIds: string[] = carts.map(cart => cart?._id.toString());

        // cartIds.map(async cartId => {
        //     await Cart.deleteOne({ _id: cartId });
        // })

        // await Profile.deleteMany({ userId: userId });

        // await User.findByIdAndDelete(userId);

        // const agg = [
        //     {
        //         $match: { _id: new Types.ObjectId('66348512895be6a86258dc35') }
        //     },
        //     {
        //         $lookup: {
        //             from: "profiles",
        //             localField: "_id",
        //             foreignField: "userId",
        //             as: "result"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "carts",
        //             localField: "result._id",
        //             foreignField: "profileId",
        //             as: "result1"
        //         }
        //     },
        //     {
        //         $project: {
        //             "result1": 1
        //         }
        //     },
        //     {
        //         $unwind: "$result1"
        //     }
        // ];

        const agg = [
            {
                $match: { _id: userId }
            },
            {
                $lookup: {
                    from: "profiles",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$userId", "$$userId"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "carts",
                                localField: "_id",
                                foreignField: "profileId",
                                as: "result1"
                            }
                        }
                    ],
                    as: "result"
                }
            },
            {
                $unwind: "$result"
            }
        ];
        

        const result = await User.aggregate(agg);
    
        const profileIds = result.map(doc => doc.result._id);
        
        const resultId=result.map(doc=>doc.result.result1)
        
        const cartIds=resultId.filter(doc=>doc.length>0).map(doc=>doc[0]._id)
        
        await Cart.deleteMany({ _id: { $in: cartIds } });

        await Profile.deleteMany({ _id: { $in: profileIds } });

        await User.findByIdAndDelete(userId);
    }
}