import {logger} from '@/lib/winston';
import type {Request, Response} from 'express';
import type {IUser} from '@/models/user';
import User from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>

const getCurrentUser = async(req: Request, res: Response): Promise<void>=>{
 
        try {
            const user = await User.findById(req.userId).select('-__.v').lean().exec();
            res.status(200).json({
                user
            });
            logger.info('Get current user info', user);
             
        } catch (error) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal server error',
                error: error
            });
            logger.error('Error while getting current user', error);
        }
}

export default getCurrentUser;
