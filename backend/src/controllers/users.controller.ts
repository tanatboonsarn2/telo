import { Request, Response, NextFunction } from 'express';
import * as usersService from '../services/users.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const users = await usersService.list(search);
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = usersService.updateMeSchema.parse(req.body);
    const user = await usersService.updateMe(req.user.id, data);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
