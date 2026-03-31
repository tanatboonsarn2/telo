import { Request, Response, NextFunction } from 'express';
import * as notificationsService from '../services/notifications.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const notifications = await notificationsService.listForUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const notification = await notificationsService.markRead(req.params.id, req.user.id);
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await notificationsService.markAllRead(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
