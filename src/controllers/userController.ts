import { Request, Response } from "express";
import { userServise } from "../services/userService";
import { userInterface } from "../constant/interface";
import { AuthenticatedRequest } from "../middleware/authentication";

export class userControl {
    static async signUpUser(req: Request, res: Response): Promise<void> {
        try {
            const user: userInterface = req.body;

            await userServise.signUp(user);

            res.status(200).json({ message: 'User successfully registered' });
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const user: userInterface = req.body;

            const token = await userServise.login(user);

            res.status(200).json({ data: token, message: "Successfully Log In" })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user: userInterface = req.body;

            const uId: string | undefined = (req as AuthenticatedRequest).uId

            if (uId !== undefined) {
                await userServise.updateDetails(user, uId);
            }

            res.status(200).json({ message: "User updated successfully" })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const uId: string | undefined = (req as AuthenticatedRequest).uId

            if (uId !== undefined) {
                await userServise.deleteDetails(uId);
            }

            res.status(200).json({ message: "User deleted successfully" })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }
}