import prisma from '../lib/prisma';

export interface CreateNotificationInput {
  userId: string;
  type: string;
  message: string;
  relatedTaskId?: string;
}

export async function createIfNeeded(input: CreateNotificationInput): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      message: input.message,
      relatedTaskId: input.relatedTaskId,
    },
  });
}

export async function listForUser(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return notifications.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function markRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw new Error('NOT_FOUND');
  if (notification.userId !== userId) throw new Error('FORBIDDEN');
  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
  return { ...updated, createdAt: updated.createdAt.toISOString() };
}

export async function markAllRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return { count: result.count };
}
