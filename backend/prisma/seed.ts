import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_COLUMNS = JSON.stringify([
  { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { id: 'inProgress', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'inReview', title: 'In Review', color: 'bg-amber-50' },
  { id: 'done', title: 'Done', color: 'bg-emerald-50' },
]);

const PASSWORD_HASH = bcrypt.hashSync('password123', 10);

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

async function main() {
  console.log('Seeding database...');

  // Clean up
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const alex = await prisma.user.create({
    data: {
      id: 'usr_001',
      fullName: 'Alex Rivera',
      email: 'alex@taskflow.app',
      password: PASSWORD_HASH,
      role: 'admin',
      avatarUrl: 'https://i.pravatar.cc/150?u=usr_001',
      createdAt: monthsAgo(6),
    },
  });

  const maria = await prisma.user.create({
    data: {
      id: 'usr_002',
      fullName: 'Maria Chen',
      email: 'maria@taskflow.app',
      password: PASSWORD_HASH,
      role: 'manager',
      avatarUrl: 'https://i.pravatar.cc/150?u=usr_002',
      createdAt: monthsAgo(5),
    },
  });

  const james = await prisma.user.create({
    data: {
      id: 'usr_003',
      fullName: 'James Okafor',
      email: 'james@taskflow.app',
      password: PASSWORD_HASH,
      role: 'member',
      avatarUrl: 'https://i.pravatar.cc/150?u=usr_003',
      createdAt: monthsAgo(4),
    },
  });

  const priya = await prisma.user.create({
    data: {
      id: 'usr_004',
      fullName: 'Priya Nair',
      email: 'priya@taskflow.app',
      password: PASSWORD_HASH,
      role: 'member',
      avatarUrl: 'https://i.pravatar.cc/150?u=usr_004',
      createdAt: monthsAgo(3),
    },
  });

  // Projects
  const proj1 = await prisma.project.create({
    data: {
      id: 'proj_001',
      name: 'Website Redesign',
      description: 'Full overhaul of the marketing site — new design system, updated copy, and improved performance.',
      ownerId: maria.id,
      status: 'active',
      dueDate: daysFromNow(30),
      columns: DEFAULT_COLUMNS,
      createdAt: daysAgo(60),
      members: {
        create: [
          { userId: alex.id },
          { userId: maria.id },
          { userId: james.id },
          { userId: priya.id },
        ],
      },
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      id: 'proj_002',
      name: 'Q2 Product Launch',
      description: 'Cross-functional initiative to ship the v2.0 feature set and coordinate the go-to-market plan.',
      ownerId: alex.id,
      status: 'active',
      dueDate: daysFromNow(75),
      columns: DEFAULT_COLUMNS,
      createdAt: daysAgo(45),
      members: {
        create: [
          { userId: alex.id },
          { userId: maria.id },
          { userId: priya.id },
        ],
      },
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      id: 'proj_003',
      name: 'Internal Tooling Cleanup',
      description: 'Audit and refactor internal scripts, dashboards, and documentation.',
      ownerId: james.id,
      status: 'active',
      dueDate: daysFromNow(5),
      columns: DEFAULT_COLUMNS,
      createdAt: daysAgo(30),
      members: {
        create: [
          { userId: maria.id },
          { userId: james.id },
        ],
      },
    },
  });

  // Tasks
  const task1 = await prisma.task.create({
    data: {
      id: 'task_001',
      projectId: proj1.id,
      title: 'Audit current site performance with Lighthouse',
      description: 'Run Lighthouse reports across the top 10 pages. Document scores and identify the top 5 issues to address.',
      status: 'done',
      priority: 'high',
      assigneeId: james.id,
      dueDate: daysAgo(10),
      createdAt: daysAgo(40),
      subtasks: JSON.stringify([
        { id: 'st_001a', title: 'Run desktop Lighthouse', completed: true },
        { id: 'st_001b', title: 'Run mobile Lighthouse', completed: true },
        { id: 'st_001c', title: 'Document findings in Notion', completed: true },
      ]),
    },
  });

  await prisma.comment.create({
    data: {
      id: 'cmt_001',
      taskId: task1.id,
      userId: james.id,
      text: 'All scores are in — performance is averaging 58 on mobile. Sharing the full report now.',
      createdAt: daysAgo(11),
    },
  });

  const task2 = await prisma.task.create({
    data: {
      id: 'task_002',
      projectId: proj1.id,
      title: 'Design new homepage hero section',
      description: 'Create 3 hero variations in Figma for stakeholder review. Must align with updated brand guide.',
      status: 'inReview',
      priority: 'urgent',
      assigneeId: priya.id,
      dueDate: daysFromNow(5),
      createdAt: daysAgo(20),
      subtasks: JSON.stringify([
        { id: 'st_002a', title: 'Review new brand guide', completed: true },
        { id: 'st_002b', title: 'Create 3 hero variants', completed: true },
        { id: 'st_002c', title: 'Share for feedback', completed: false },
      ]),
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        id: 'cmt_002',
        taskId: task2.id,
        userId: maria.id,
        text: 'Variant B is looking strong — can we also try a version with the product screenshot on the right?',
        createdAt: daysAgo(2),
      },
      {
        id: 'cmt_003',
        taskId: task2.id,
        userId: priya.id,
        text: 'On it! Will have it ready by tomorrow morning.',
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.task.create({
    data: {
      id: 'task_003',
      projectId: proj1.id,
      title: 'Write copy for About Us page',
      description: 'Update team bios and company mission statement. Work with Maria on tone and messaging.',
      status: 'inProgress',
      priority: 'medium',
      assigneeId: james.id,
      dueDate: daysFromNow(10),
      createdAt: daysAgo(15),
    },
  });

  await prisma.task.create({
    data: {
      id: 'task_004',
      projectId: proj2.id,
      title: 'Define v2.0 feature scope',
      description: 'Collaborate with engineering leads to finalize the feature list and cut scope that won\'t be ready for launch.',
      status: 'done',
      priority: 'urgent',
      assigneeId: alex.id,
      dueDate: daysAgo(5),
      createdAt: daysAgo(35),
      subtasks: JSON.stringify([
        { id: 'st_004a', title: 'Engineering sync meeting', completed: true },
        { id: 'st_004b', title: 'Update feature list in PRD', completed: true },
      ]),
    },
  });

  await prisma.task.create({
    data: {
      id: 'task_005',
      projectId: proj2.id,
      title: 'Create launch announcement email',
      description: 'Draft the product launch email for existing customers. Target send date: June 10.',
      status: 'todo',
      priority: 'medium',
      assigneeId: priya.id,
      dueDate: daysFromNow(60),
      createdAt: daysAgo(10),
      subtasks: JSON.stringify([
        { id: 'st_005a', title: 'Draft copy', completed: false },
        { id: 'st_005b', title: 'Design email template', completed: false },
        { id: 'st_005c', title: 'A/B test subject lines', completed: false },
      ]),
    },
  });

  await prisma.task.create({
    data: {
      id: 'task_006',
      projectId: proj2.id,
      title: 'Set up analytics tracking for new features',
      description: 'Instrument key events in Amplitude — feature adoption, drop-off points, and conversion milestones.',
      status: 'inProgress',
      priority: 'high',
      assigneeId: maria.id,
      dueDate: daysFromNow(45),
      createdAt: daysAgo(12),
    },
  });

  await prisma.task.create({
    data: {
      id: 'task_007',
      projectId: proj3.id,
      title: 'Archive deprecated internal scripts',
      description: 'Identify scripts not used in the last 6 months and move to /archive with a README explaining the decision.',
      status: 'inProgress',
      priority: 'low',
      assigneeId: james.id,
      dueDate: daysAgo(1),
      createdAt: daysAgo(25),
      subtasks: JSON.stringify([
        { id: 'st_007a', title: 'Audit script usage logs', completed: true },
        { id: 'st_007b', title: 'Move to /archive folder', completed: false },
      ]),
    },
  });

  // Notifications (for alex)
  await prisma.notification.createMany({
    data: [
      {
        id: 'notif_001',
        userId: alex.id,
        type: 'taskAssigned',
        message: "Maria Chen assigned you to 'Define v2.0 feature scope'",
        relatedTaskId: 'task_004',
        read: true,
        createdAt: daysAgo(34),
      },
      {
        id: 'notif_002',
        userId: alex.id,
        type: 'comment',
        message: "Priya Nair commented on 'Design new homepage hero section'",
        relatedTaskId: 'task_002',
        read: false,
        createdAt: daysAgo(1),
      },
      {
        id: 'notif_003',
        userId: alex.id,
        type: 'statusChange',
        message: "James Okafor moved 'Audit current site performance' to Done",
        relatedTaskId: 'task_001',
        read: false,
        createdAt: daysAgo(9),
      },
    ],
  });

  console.log('Seed complete!');
  console.log('Test accounts (all with password: password123):');
  console.log('  alex@taskflow.app (admin)');
  console.log('  maria@taskflow.app (manager)');
  console.log('  james@taskflow.app (member)');
  console.log('  priya@taskflow.app (member)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
