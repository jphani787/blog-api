import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import User from '@/models/user';

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-__.v').exec();
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }
    res.status(200).json({
      user,
    });
    logger.info('Get current user info', user);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error while getting a user', error);
  }
};

export default getUser;
