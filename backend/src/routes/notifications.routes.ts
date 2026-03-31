import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as notificationsController from '../controllers/notifications.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', notificationsController.list);
router.patch('/read-all', notificationsController.markAllRead);
router.patch('/:id', notificationsController.markRead);

export default router;
