import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { logger } from '@/lib/winston';
import Token from "@/models/token";

import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";

import type { Request, Response } from 'express';
import {Types} from 'mongoose';

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;
    try {
        const token = await Token.exists({token: refreshToken});
        if(!token){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token'
            })
            return;
        }

        const jwtPayload = verifyRefreshToken(refreshToken) as {userId: Types.ObjectId};
        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            accessToken
        })
    } catch (error) {
        if(error instanceof TokenExpiredError){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token expired, please login again.'
            })
            return;
        }

        if(error instanceof JsonWebTokenError){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token'
            })
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error
        })
    }
}

export default refreshToken;