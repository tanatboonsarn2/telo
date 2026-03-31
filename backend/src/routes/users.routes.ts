import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as usersController from '../controllers/users.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', usersController.list);
router.patch('/me', usersController.updateMe);

export default router;
