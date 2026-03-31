import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as commentsController from '../controllers/comments.controller';

const router = Router();

router.use(authMiddleware);

router.delete('/:id', commentsController.remove);

export default router;
