import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import Comment from '@/models/comment';
import type { IComment } from '@/models/comment';
import type { Request, Response } from 'express';

type CommentData = Pick<IComment, 'content' | 'userId'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (req: Request, res: Response): Promise<void> => {
  const { content, userId } = req.body as CommentData;
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const clenContent = purify.sanitize(content);
    const newComment = await Comment.create({
      blogId,
      content: clenContent,
      userId,
    });

    logger.info('New comment created', newComment);
    blog.commentsCount++;
    await blog.save();
    logger.info('Blog comments count update', {
      blogId: blog._id,
      commentCount: blog.commentsCount,
    });
    res.status(201).json({
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });
    logger.error('Error while commenting blog', error);
  }
};

export default commentBlog;
