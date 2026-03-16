import { Router } from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/blog.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, requireRole('doctor', 'admin'), createPost);
router.put('/:id', protect, requireRole('doctor', 'admin'), updatePost);
router.delete('/:id', protect, requireRole('doctor', 'admin'), deletePost);

export default router;
