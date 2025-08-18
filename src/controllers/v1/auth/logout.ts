import {logger} from '@/lib/winston';
import config from '@/config';
import type {Request, Response} from 'express';
import Token from '@/models/token';

const logout = async(req: Request, res: Response): Promise<void>=>{
        try {
            const refreshToken = req.cookies.refreshToken as string;
            if(refreshToken) {
                await Token.deleteOne({token: refreshToken})
                logger.info('User refrach token deleted successfully', {
                    userId: req.userId,
                    token: refreshToken
                });
            } 
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: config.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.sendStatus(204);
            logger.info('User logged out successfully', {
                userId: req.userId
            });
        } catch (error) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal server error',
                error: error
            });
            logger.error('Error during logout', error);
        }
}

export default logout;