import { z } from 'zod';
import prisma from '../lib/prisma';

export const updateMeSchema = z.object({
  fullName: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

function safeUser(user: { id: string; fullName: string; email: string; role: string; avatarUrl: string | null; createdAt: Date }) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function list(search?: string) {
  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { fullName: 'asc' },
  });
  return users.map(safeUser);
}

export async function updateMe(userId: string, data: z.infer<typeof updateMeSchema>) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return safeUser(user);
}
