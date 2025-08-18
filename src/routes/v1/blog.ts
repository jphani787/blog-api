import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import Blog from '@/models/blog';
import createBlog from '@/controllers/v1/blog/create-blog';
import getBlogs from '@/controllers/v1/blog/get-blogs';
import getBlogsByUser from '@/controllers/v1/blog/get-blogs-by-user';
import getBlogsBySlug from '@/controllers/v1/blog/get-blog-by-slug';
import deleteBlog from '@/controllers/v1/blog/delete-blog';
import updateBlog from '@/controllers/v1/blog/update-blog';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';

const upload = multer();
const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less then 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  body('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Office must be a positive integer'),
  validationError,
  getBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId').isMongoId().withMessage('Invalid user Id'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  body('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Office must be a positive integer'),
  validationError,
  getBlogsByUser,
);

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogsBySlug,
);

router.put(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  upload.single('banner_image'),
  body('title')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Titlw must be less then 180 characters'),
  body('content'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  uploadBlogBanner('put'),
  updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  validationError,
  deleteBlog,
);

export default router;
