import { Router } from 'express';
import { param, query, body } from 'express-validator';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import likeBlog from '@/controllers/v1/like/create-like';
import unlikeBlog from '@/controllers/v1/like/unlike';
const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user id'),
  validationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user id'),
  validationError,
  unlikeBlog,
);

export default router;
