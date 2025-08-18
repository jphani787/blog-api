import {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';
import type {Request, Response, NextFunction} from 'express';
import config from '@/config';
import {logger} from '@/lib/winston';
import {Types} from 'mongoose';
import { verifyAccessToken } from '@/lib/jwt';

const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if(!authHeader?.startsWith('Bearer ')){
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access denied, no token provided'
        })
        return;
    }

    const [_, token] = authHeader.split(' ');
    try {
        const jwtPayload = verifyAccessToken(token) as {userId: Types.ObjectId};
        req.userId = jwtPayload.userId;
        return next();
    } catch (error) {
        if(error instanceof TokenExpiredError){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token expired, request a new one with refresh token'
            })
            return;
        }

        if(error instanceof JsonWebTokenError){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid access token'
            })
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error
        })
        logger.error('Error during authentication', error);
    }
}

export default authenticate;
