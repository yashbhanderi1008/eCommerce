import { Request, Response } from "express";
import { profileInterface } from "../constant/interface";
import { profileService } from "../services/profileService";
import { AuthenticatedRequest } from "../middleware/authentication";

export class profileControl {
    static async createProfile(req: Request, res: Response) {
        try {
            const newProfile: profileInterface = req.body;

            const userId: string | undefined = (req as AuthenticatedRequest).uId

            if (userId !== undefined) {
                const createdProfile: profileInterface = await profileService.profileCreation(newProfile, userId);

                res.status(200).json({ data: createdProfile, message: 'Profile created successfully' });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async showProfile(req: Request, res: Response) {
        try {
            const userId: string | undefined = (req as AuthenticatedRequest).uId

            if (userId !== undefined) {
                const profileList = await profileService.profileList(userId);

                res.status(200).json({ data: profileList });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async switchProfile(req: Request, res: Response) {
        try {
            const userId: string | undefined = (req as AuthenticatedRequest).uId

            const profileId: string = req.params.profileId;

            if (userId !== undefined) {
                const profile = await profileService.profileSwitching(profileId, userId);

                res.status(200).json({ data: profile.token, message: `Profile switched to ${profile.profileName}` });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const profile: profileInterface = req.body;

            const pId: string | undefined = (req as AuthenticatedRequest).pId
            const uId: string | undefined = (req as AuthenticatedRequest).uId

            if (pId !== undefined && uId !== undefined) {
                await profileService.profileUpdation(pId, uId, profile);

                res.status(200).json({ message: 'Profile updated successfully' });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async deleteProfile(req: Request, res: Response) {
        try {
            const pId: string | undefined = (req as AuthenticatedRequest).pId
            const uId: string | undefined = (req as AuthenticatedRequest).uId

            if (pId !== undefined && uId !== undefined) {
                await profileService.profileDeletion(pId, uId);

                res.status(200).json({ message: 'Profile deleted successfully' });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }
}