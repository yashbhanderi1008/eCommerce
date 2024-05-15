import jwt from "jsonwebtoken";
import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import { Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    uId?: string
    pId?: string
}

export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return res.status(401).send({ message: 'Token is not set in Request Header' });
        }

        token = token.replace('Bearer ', '');

        const decoded = jwt.verify(token, 'YashBhanderi') as { uId: Types.ObjectId };

        const user = await User.findById(decoded.uId);

        if (!user) {
            return res.status(401).send({ message: 'Authorization Error' });
        }

        (req as AuthenticatedRequest).uId = decoded.uId.toString();

        next();
    } catch (error: any) {
        res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
}

export const authorizeProfile = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.header('Authorization');

        if (!token) {
            res.send({ message: 'Token is not set in Request Header' });
        }

        token = token!.replace('Bearer ', '');

        const decoded = jwt.verify(token, 'YashBhanderi') as { pId: Types.ObjectId, uId: Types.ObjectId };

        (req as AuthenticatedRequest).pId = decoded.pId.toString();
        (req as AuthenticatedRequest).uId = decoded.uId.toString();

        next();
    } catch (error) {
        res.send({ message: error });
    }
}