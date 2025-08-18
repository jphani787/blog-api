import {Router} from 'express';
import {body, cookie} from 'express-validator';
import register from '@/controllers/v1/auth/register';
import login from '@/controllers/v1/auth/login';
import logout from '@/controllers/v1/auth/logout';
import refreshToken from '@/controllers/v1/auth/refresh-token';
import validationError from '@/middlewares/validationError';
import authenticate from '@/middlewares/authenticate';
import bcrypt from 'bcrypt';

import User from '@/models/user';

const router = Router();
router.post('/register', 
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({max: 50})
    .withMessage('Email must be less then 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
        const userExist = await User.exists({email});
        if(userExist) {
            throw new Error('User already exist!');
        }
    }),
    body('password')
    .notEmpty()
    .isLength({min: 8})
    .withMessage('Password is must be least 8 characters long'),
    body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),    
    validationError, 
    register);

router.post('/login', body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({max: 50})
    .withMessage('Email must be less then 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
        const userExist = await User.exists({email});
        if(!userExist) {
            throw new Error('Email is not exist!');
        }
    }),
    body('password')
    .notEmpty()
    .isLength({min: 8})
    .withMessage('Password is must be least 8 characters long')
    .custom(async (value, {req}) => {
        const {email} = req.body as {email: string}
        const user = await User.findOne({email})
        .select('password')
        .lean()
        .exec();

        if(!user) {
            throw new Error('User email or password invalid!');
        }

        const passwordMatched = await bcrypt.compare(value, user.password)
        if(!passwordMatched){
            throw new Error('Incorrect Password');
        }
    }),
    validationError, 
    login);

router.post('/refresh-token', 
    cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token'),
    validationError,
    refreshToken)

router.post('/logout',
    authenticate,
    logout)

export default router;

