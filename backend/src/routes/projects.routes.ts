import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as projectsController from '../controllers/projects.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', projectsController.list);
router.post('/', projectsController.create);
router.get('/:id', projectsController.getOne);
router.patch('/:id', projectsController.update);
router.delete('/:id', projectsController.remove);

export default router;
