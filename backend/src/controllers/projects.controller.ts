import { Request, Response, NextFunction } from 'express';
import * as projectsService from '../services/projects.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await projectsService.list(req.user.id);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await projectsService.getOne(req.params.id, req.user.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = projectsService.createProjectSchema.parse(req.body);
    const project = await projectsService.create(req.user.id, data);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = projectsService.updateProjectSchema.parse(req.body);
    const project = await projectsService.update(req.params.id, req.user.id, data);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await projectsService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
