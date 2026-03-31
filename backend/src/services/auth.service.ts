import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { env } from '../config/env';

export const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

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

export async function register(data: z.infer<typeof registerSchema>) {
  const hash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { fullName: data.fullName, email: data.email, password: hash },
  });
  const token = signToken(user);
  return { user: safeUser(user), token };
}

export async function login(data: z.infer<typeof loginSchema>) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new Error('INVALID_CREDENTIALS');

  const token = signToken(user);
  return { user: safeUser(user), token };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('NOT_FOUND');
  return safeUser(user);
}
