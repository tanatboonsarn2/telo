import { z } from 'zod';
import prisma from '../lib/prisma';
import { parseJsonField, stringifyJsonField } from '../lib/json';

export interface ProjectColumn {
  id: string;
  title: string;
  color: string;
}

const DEFAULT_COLUMNS: ProjectColumn[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'inReview', title: 'In Review', color: 'bg-yellow-100' },
  { id: 'done', title: 'Done', color: 'bg-green-100' },
];

export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(['active', 'archived']).optional(),
  memberIds: z.array(z.string()).optional(),
  columns: z.array(z.object({ id: z.string(), title: z.string(), color: z.string() })).optional(),
});

export async function assertProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project) throw new Error('NOT_FOUND');
  const isMember =
    project.ownerId === userId ||
    project.members.some((m) => m.userId === userId);
  if (!isMember) throw new Error('FORBIDDEN');
  return project;
}

async function computeTaskStats(projectId: string) {
  const groups = await prisma.task.groupBy({
    by: ['status'],
    where: { projectId },
    _count: { id: true },
  });
  const byStatus: Record<string, number> = {};
  let total = 0;
  for (const g of groups) {
    byStatus[g.status] = g._count.id;
    total += g._count.id;
  }
  return {
    total,
    todo: byStatus['todo'] ?? 0,
    inProgress: byStatus['inProgress'] ?? 0,
    inReview: byStatus['inReview'] ?? 0,
    done: byStatus['done'] ?? 0,
    byStatus,
  };
}

function formatProject(
  project: {
    id: string; name: string; description: string | null; ownerId: string;
    status: string; dueDate: Date | null; columns: string; createdAt: Date;
    members: { userId: string; joinedAt: Date }[];
  },
  taskStats: { total: number; byStatus: Record<string, number> }
) {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    status: project.status,
    dueDate: project.dueDate ? project.dueDate.toISOString().split('T')[0] : null,
    createdAt: project.createdAt.toISOString(),
    columns: parseJsonField<ProjectColumn[]>(project.columns, DEFAULT_COLUMNS),
    memberIds: project.members.map((m) => m.userId),
    taskStats,
  };
}

export async function list(userId: string) {
  const projects = await prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: { members: true },
    orderBy: { createdAt: 'desc' },
  });

  return Promise.all(
    projects.map(async (p) => {
      const taskStats = await computeTaskStats(p.id);
      return formatProject(p, taskStats);
    })
  );
}

export async function getOne(projectId: string, userId: string) {
  const project = await assertProjectAccess(projectId, userId);
  const taskStats = await computeTaskStats(projectId);
  return formatProject(project, taskStats);
}

export async function create(userId: string, data: z.infer<typeof createProjectSchema>) {
  const memberIds = data.memberIds ?? [];
  // Always include the owner as a member
  const allMemberIds = Array.from(new Set([userId, ...memberIds]));

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      columns: stringifyJsonField(DEFAULT_COLUMNS),
      members: {
        create: allMemberIds.map((id) => ({ userId: id })),
      },
    },
    include: { members: true },
  });

  return formatProject(project, { total: 0, byStatus: {} });
}

export async function update(projectId: string, userId: string, data: z.infer<typeof updateProjectSchema>) {
  await assertProjectAccess(projectId, userId);

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.columns !== undefined) updateData.columns = stringifyJsonField(data.columns);

  // Handle member updates via transaction if memberIds provided
  if (data.memberIds !== undefined) {
    const ownerId = (await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } }))!.ownerId;
    const allMemberIds = Array.from(new Set([ownerId, ...data.memberIds]));

    await prisma.$transaction([
      prisma.project.update({ where: { id: projectId }, data: updateData }),
      prisma.projectMember.deleteMany({ where: { projectId } }),
      prisma.projectMember.createMany({
        data: allMemberIds.map((uid) => ({ projectId, userId: uid })),
      }),
    ]);
  } else {
    await prisma.project.update({ where: { id: projectId }, data: updateData });
  }

  const updated = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  const taskStats = await computeTaskStats(projectId);
  return formatProject(updated!, taskStats);
}

export async function remove(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('NOT_FOUND');
  if (project.ownerId !== userId) throw new Error('FORBIDDEN');
  await prisma.project.delete({ where: { id: projectId } });
}
