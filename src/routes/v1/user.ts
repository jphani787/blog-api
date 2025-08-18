import { Router } from 'express';
import { param, query, body } from 'express-validator';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import User from '@/models/user';
import getCurrentUser from '@/controllers/v1/user/get-current-user';
import updateCurrentUser from '@/controllers/v1/user/update-current-user';
import deleteCurrentUser from '@/controllers/v1/user/delete-current-user';
import getAllUsers from '@/controllers/v1/user/get-all-users';
import getUser from '@/controllers/v1/user/get-user';
import deleteUser from '@/controllers/v1/user/delete-user';
const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less then 20 characters')
    .custom(async (username) => {
      const userExist = await User.exists({ username });
      if (userExist) {
        throw new Error('Username already exist.');
      }
    }),
  body('email')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Email must be less then 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
      const userExist = await User.exists({ email });
      if (userExist) {
        throw new Error('Email already in use.');
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password is must be least 8 characters long'),
  body('first_name')
    .optional()
    .isLength({ min: 5 })
    .withMessage('First name must be least 5 characters'),
  body('last_name')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Last name must be least 1 characters'),
  body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('URL must be less then 100 characters'),
  validationError,
  updateCurrentUser,
);

router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Page must be a positive integer'),
  validationError,
  deleteCurrentUser,
);

router.get('/', authenticate, authorize(['admin']), getAllUsers);
router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user Id'),
  validationError,
  getUser,
);

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user Id'),
  validationError,
  deleteUser,
);

export default router;
