import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { logger } from '@/lib/winston';
import Blog, { IBlog } from '@/models/blog';
import type { Request, Response } from 'express';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, banner, content, status } = req.body as BlogData;
    const userId = req.userId;
    const clenContent = purify.sanitize(content);
    const newBlog = await Blog.create({
      title,
      content: clenContent,
      banner,
      status,
      author: userId,
    });
    logger.info('New blog created', newBlog);
    res.status(200).json({
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error during blog creation', error);
  }
};

export default createBlog;
