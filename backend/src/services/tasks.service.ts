import { z } from 'zod';
import prisma from '../lib/prisma';
import { parseJsonField, stringifyJsonField } from '../lib/json';
import { assertProjectAccess, ProjectColumn } from './projects.service';
import * as notificationsService from './notifications.service';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string().min(1),
  assigneeId: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().optional().nullable(),
  status: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  subtasks: z.array(z.object({ id: z.string(), title: z.string(), completed: z.boolean() })).optional(),
});

function formatTask(task: {
  id: string; projectId: string; title: string; description: string | null;
  status: string; priority: string; assigneeId: string | null; dueDate: Date | null;
  subtasks: string; createdAt: Date;
  comments?: { id: string; taskId: string; userId: string; text: string; createdAt: Date; user: { id: string; fullName: string; avatarUrl: string | null } }[];
}) {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
    createdAt: task.createdAt.toISOString(),
    subtasks: parseJsonField<Subtask[]>(task.subtasks, []),
    comments: task.comments?.map((c) => ({
      id: c.id,
      taskId: c.taskId,
      userId: c.userId,
      text: c.text,
      createdAt: c.createdAt.toISOString(),
      user: c.user,
    })) ?? [],
  };
}

export async function list(userId: string, projectId?: string, assigneeId?: string) {
  // Verify user has access to the project if projectId is given
  if (projectId) {
    await assertProjectAccess(projectId, userId);
  }

  const tasks = await prisma.task.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      ...(assigneeId ? { assigneeId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  return tasks.map((t) => formatTask(t));
}

export async function getOne(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      comments: {
        include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!task) throw new Error('NOT_FOUND');
  await assertProjectAccess(task.projectId, userId);
  return formatTask(task);
}

export async function create(userId: string, data: z.infer<typeof createTaskSchema>) {
  await assertProjectAccess(data.projectId, userId);

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      priority: data.priority ?? 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: data.status ?? 'todo',
      subtasks: stringifyJsonField([]),
    },
  });

  // Notify assignee if different from creator
  if (task.assigneeId && task.assigneeId !== userId) {
    notificationsService.createIfNeeded({
      userId: task.assigneeId,
      type: 'taskAssigned',
      message: `You were assigned to "${task.title}"`,
      relatedTaskId: task.id,
    }).catch(console.error);
  }

  return formatTask(task);
}

export async function update(taskId: string, userId: string, data: z.infer<typeof updateTaskSchema>) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw new Error('NOT_FOUND');
  await assertProjectAccess(existing.projectId, userId);

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.subtasks !== undefined) updateData.subtasks = stringifyJsonField(data.subtasks);

  const task = await prisma.task.update({ where: { id: taskId }, data: updateData });

  // Notify on assignee change
  if (data.assigneeId !== undefined && data.assigneeId && data.assigneeId !== userId && data.assigneeId !== existing.assigneeId) {
    notificationsService.createIfNeeded({
      userId: data.assigneeId,
      type: 'taskAssigned',
      message: `You were assigned to "${task.title}"`,
      relatedTaskId: task.id,
    }).catch(console.error);
  }

  // Notify on status change
  if (data.status !== undefined && data.status !== existing.status && task.assigneeId && task.assigneeId !== userId) {
    // Look up column title from project columns JSON
    const project = await prisma.project.findUnique({ where: { id: task.projectId }, select: { columns: true } });
    const columns = parseJsonField<ProjectColumn[]>(project?.columns ?? '[]', []);
    const col = columns.find((c) => c.id === data.status);
    const colTitle = col?.title ?? data.status;

    notificationsService.createIfNeeded({
      userId: task.assigneeId,
      type: 'statusChange',
      message: `"${task.title}" was moved to ${colTitle}`,
      relatedTaskId: task.id,
    }).catch(console.error);
  }

  return formatTask(task);
}

export async function remove(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('NOT_FOUND');
  await assertProjectAccess(task.projectId, userId);
  await prisma.task.delete({ where: { id: taskId } });
}
