import { Router } from 'express';
import { getPosts, createPost, toggleLike, addComment, deletePost } from '../controllers/community.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

export default router;
