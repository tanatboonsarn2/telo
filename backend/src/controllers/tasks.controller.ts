import { Request, Response, NextFunction } from 'express';
import * as tasksService from '../services/tasks.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = typeof req.query.projectId === 'string' ? req.query.projectId : undefined;
    const assigneeId = typeof req.query.assigneeId === 'string' ? req.query.assigneeId : undefined;
    const tasks = await tasksService.list(req.user.id, projectId, assigneeId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await tasksService.getOne(req.params.id, req.user.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = tasksService.createTaskSchema.parse(req.body);
    const task = await tasksService.create(req.user.id, data);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = tasksService.updateTaskSchema.parse(req.body);
    const task = await tasksService.update(req.params.id, req.user.id, data);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await tasksService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
