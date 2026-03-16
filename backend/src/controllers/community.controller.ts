import { Request, Response, NextFunction } from 'express';
import CommunityPost from '../models/CommunityPost';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

// GET /api/community  (public)
export const getPosts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: posts });
  } catch (err) { next(err); }
};

// POST /api/community  (auth)
export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await CommunityPost.create({
      ...req.body,
      userId: req.user!._id,
      userName: req.user!.name,
      userAvatar: req.user!.avatar,
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

// POST /api/community/:id/like  (auth — toggle)
export const toggleLike = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await CommunityPost.findById(req.params['id']);
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }

    const uid = req.user!._id as mongoose.Types.ObjectId;
    const alreadyLiked = post.likedBy.some(id => id.equals(uid));

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => !id.equals(uid));
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(uid);
      post.likes += 1;
    }

    await post.save();
    res.json({ success: true, data: { likes: post.likes, liked: !alreadyLiked } });
  } catch (err) { next(err); }
};

// POST /api/community/:id/comment  (auth)
export const addComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await CommunityPost.findById(req.params['id']);
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }

    post.comments.push({
      userId: req.user!._id as mongoose.Types.ObjectId,
      userName: req.user!.name,
      content: req.body.content,
      createdAt: new Date(),
    });
    await post.save();
    res.status(201).json({ success: true, data: post.comments });
  } catch (err) { next(err); }
};

// DELETE /api/community/:id  (owner | admin)
export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter = req.user!.role === 'admin'
      ? { _id: req.params['id'] }
      : { _id: req.params['id'], userId: req.user!._id };
    const post = await CommunityPost.findOneAndDelete(filter);
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
};
