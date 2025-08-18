import { Router } from 'express';
import { param, body } from 'express-validator';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import commentBlog from '@/controllers/v1/comment/comment-blog';
import getCommentsByBlog from '@/controllers/v1/comment/get-comment-blog';
import deleteComment from '@/controllers/v1/comment/delete-comment';
const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog id'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  commentBlog,
);

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog id'),
  validationError,
  getCommentsByBlog,
);

router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin', 'user']),
  param('commentId').isMongoId().withMessage('Invalid comment id'),
  deleteComment,
);

export default router;
