import { z } from 'zod';
import prisma from '../lib/prisma';
import { assertProjectAccess } from './projects.service';
import * as notificationsService from './notifications.service';

export const createCommentSchema = z.object({
  text: z.string().min(1),
});

export async function create(taskId: string, userId: string, data: z.infer<typeof createCommentSchema>) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('NOT_FOUND');
  await assertProjectAccess(task.projectId, userId);

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { fullName: true } });

  const comment = await prisma.comment.create({
    data: { taskId, userId, text: data.text },
    include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
  });

  // Notify task assignee if different from commenter
  if (task.assigneeId && task.assigneeId !== userId) {
    notificationsService.createIfNeeded({
      userId: task.assigneeId,
      type: 'comment',
      message: `${user?.fullName ?? 'Someone'} commented on "${task.title}"`,
      relatedTaskId: task.id,
    }).catch(console.error);
  }

  return {
    id: comment.id,
    taskId: comment.taskId,
    userId: comment.userId,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
    user: comment.user,
  };
}

export async function remove(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error('NOT_FOUND');
  if (comment.userId !== userId) throw new Error('FORBIDDEN');
  await prisma.comment.delete({ where: { id: commentId } });
}
