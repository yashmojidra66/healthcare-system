import { Request, Response, NextFunction } from 'express';
import BlogPost from '../models/BlogPost';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/blog  (public)
export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const posts = await BlogPost.find(filter).sort({ publishedAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { next(err); }
};

// GET /api/blog/:id  (public)
export const getPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await BlogPost.findById(req.params['id']);
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// POST /api/blog  (doctor | admin)
export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await BlogPost.create({
      ...req.body,
      author: req.user!._id,
      authorName: req.user!.name,
      authorAvatar: req.user!.avatar,
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

// PUT /api/blog/:id  (author | admin)
export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = req.user!.role === 'admin'
      ? { _id: req.params['id'] }
      : { _id: req.params['id'], author: req.user!._id };
    const post = await BlogPost.findOneAndUpdate(filter, req.body, { new: true });
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

// DELETE /api/blog/:id  (author | admin)
export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = req.user!.role === 'admin'
      ? { _id: req.params['id'] }
      : { _id: req.params['id'], author: req.user!._id };
    const post = await BlogPost.findOneAndDelete(filter);
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
};
