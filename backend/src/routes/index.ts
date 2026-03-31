import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import projectsRoutes from './projects.routes';
import tasksRoutes from './tasks.routes';
import commentsRoutes from './comments.routes';
import notificationsRoutes from './notifications.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/comments', commentsRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
