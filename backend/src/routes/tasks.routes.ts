import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as tasksController from '../controllers/tasks.controller';
import * as commentsController from '../controllers/comments.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', tasksController.list);
router.post('/', tasksController.create);
router.get('/:id', tasksController.getOne);
router.patch('/:id', tasksController.update);
router.delete('/:id', tasksController.remove);

// Nested comments
router.post('/:taskId/comments', commentsController.create);

export default router;
