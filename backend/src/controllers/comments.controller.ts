import { Request, Response, NextFunction } from 'express';
import * as commentsService from '../services/comments.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = commentsService.createCommentSchema.parse(req.body);
    const comment = await commentsService.create(req.params.taskId, req.user.id, data);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await commentsService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
