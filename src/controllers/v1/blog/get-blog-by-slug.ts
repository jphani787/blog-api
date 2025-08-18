import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import User from '@/models/user';
import Blog from '@/models/blog';
import config from '@/config';

interface QueryType {
  status?: 'draft' | 'published';
}

const getBlogsBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const slug = req.params.slug;
    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const query: QueryType = {};
    if (user?.role === 'user' && blog.status === 'draft') {
      query.status = 'published';
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
      logger.warn('A user tried to access draft blog', {
        userId,
        blog,
      });
      return;
    }

    res.status(200).json({
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error while getting all blog by slug', error);
  }
};

export default getBlogsBySlug;
