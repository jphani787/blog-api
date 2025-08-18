import {logger} from '@/lib/winston';
import config from '@/config';

import type {Request, Response} from 'express';
import type {IUser} from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

import User from '@/models/user';
import Token from '@/models/token';

type UserData = Pick<IUser, 'email' | 'password'>

const login = async(req: Request, res: Response): Promise<void>=>{
    const { email, password } = req.body as UserData; 
        console.log(email, password);
        try {

            const user = await User.findOne({email})
            .select('username email password role')
            .lean()
            .exec();
            if(!user) {
                res.status(404).json({
                    code: 'NotFound',
                    message: 'User not found!'
                });
                return;
            }
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            
            await Token.create({token: refreshToken, userId: user._id});
            logger.info('Refresh token created for user', {
                            token: refreshToken, 
                            userId: user._id
                        });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: config.NODE_ENV === 'production',
                sameSite: 'strict'
            });
    
            res.status(200).json({
                user: {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
                accessToken
            });
    
            logger.info('User registered successfully', user);
        } catch (error) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal server error',
                error: error
            });
            logger.error('Error during user registration', error);
        }
}

export default login;
