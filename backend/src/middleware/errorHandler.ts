import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', issues: err.errors });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Already exists' });
      return;
    }
  }

  if (err instanceof Error && err.message === 'FORBIDDEN') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  if (err instanceof Error && err.message === 'NOT_FOUND') {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
