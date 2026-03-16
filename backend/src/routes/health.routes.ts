import { Router } from 'express';
import { getLogs, createLog, updateLog, deleteLog } from '../controllers/health.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(getLogs)
  .post(createLog);

router.route('/:id')
  .put(updateLog)
  .delete(deleteLog);

export default router;
