import { User, Project, Task, Notification } from '../types';

// Helper to get relative dates
const now = new Date();
const daysAgo = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
};
const daysFromNow = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};
const monthsAgo = (months: number) => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - months);
  return d.toISOString();
};

export const mockUsers: User[] = [
  {
    id: "usr_001",
    fullName: "Alex Rivera",
    email: "alex@taskflow.app",
    role: "admin",
    avatarUrl: "https://i.pravatar.cc/150?u=usr_001",
    createdAt: monthsAgo(6)
  },
  {
    id: "usr_002",
    fullName: "Maria Chen",
    email: "maria@taskflow.app",
    role: "manager",
    avatarUrl: "https://i.pravatar.cc/150?u=usr_002",
    createdAt: monthsAgo(5)
  },
  {
    id: "usr_003",
    fullName: "James Okafor",
    email: "james@taskflow.app",
    role: "member",
    avatarUrl: "https://i.pravatar.cc/150?u=usr_003",
    createdAt: monthsAgo(4)
  },
  {
    id: "usr_004",
    fullName: "Priya Nair",
    email: "priya@taskflow.app",
    role: "member",
    avatarUrl: "https://i.pravatar.cc/150?u=usr_004",
    createdAt: monthsAgo(3)
  }
];

export const mockProjects: Project[] = [
  {
    id: "proj_001",
    name: "Website Redesign",
    description: "Full overhaul of the marketing site — new design system, updated copy, and improved performance.",
    ownerId: "usr_002",
    memberIds: ["usr_001", "usr_002", "usr_003", "usr_004"],
    status: "active",
    dueDate: daysFromNow(30),
    createdAt: daysAgo(60),
    taskStats: {
      total: 24,
      todo: 8,
      inProgress: 9,
      inReview: 4,
      done: 3
    },
    columns: [
      { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
      { id: 'inProgress', title: 'In Progress', color: 'bg-blue-50' },
      { id: 'inReview', title: 'In Review', color: 'bg-amber-50' },
      { id: 'done', title: 'Done', color: 'bg-emerald-50' },
    ]
  },
  {
    id: "proj_002",
    name: "Q2 Product Launch",
    description: "Cross-functional initiative to ship the v2.0 feature set and coordinate the go-to-market plan.",
    ownerId: "usr_001",
    memberIds: ["usr_001", "usr_002", "usr_004"],
    status: "active",
    dueDate: daysFromNow(75),
    createdAt: daysAgo(45),
    taskStats: {
      total: 31,
      todo: 15,
      inProgress: 10,
      inReview: 3,
      done: 3
    },
    columns: [
      { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
      { id: 'inProgress', title: 'In Progress', color: 'bg-blue-50' },
      { id: 'inReview', title: 'In Review', color: 'bg-amber-50' },
      { id: 'done', title: 'Done', color: 'bg-emerald-50' },
    ]
  },
  {
    id: "proj_003",
    name: "Internal Tooling Cleanup",
    description: "Audit and refactor internal scripts, dashboards, and documentation.",
    ownerId: "usr_003",
    memberIds: ["usr_002", "usr_003"],
    status: "active",
    dueDate: daysFromNow(5),
    createdAt: daysAgo(30),
    taskStats: {
      total: 12,
      todo: 1,
      inProgress: 2,
      inReview: 1,
      done: 8
    },
    columns: [
      { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
      { id: 'inProgress', title: 'In Progress', color: 'bg-blue-50' },
      { id: 'inReview', title: 'In Review', color: 'bg-amber-50' },
      { id: 'done', title: 'Done', color: 'bg-emerald-50' },
    ]
  }
];

export const mockTasks: Task[] = [
  {
    id: "task_001",
    projectId: "proj_001",
    title: "Audit current site performance with Lighthouse",
    description: "Run Lighthouse reports across the top 10 pages. Document scores and identify the top 5 issues to address.",
    status: "done",
    priority: "high",
    assigneeId: "usr_003",
    dueDate: daysAgo(10).split('T')[0],
    createdAt: daysAgo(40),
    subtasks: [
      { id: "st_001a", title: "Run desktop Lighthouse", completed: true },
      { id: "st_001b", title: "Run mobile Lighthouse", completed: true },
      { id: "st_001c", title: "Document findings in Notion", completed: true }
    ],
    comments: [
      {
        id: "cmt_001",
        userId: "usr_003",
        text: "All scores are in — performance is averaging 58 on mobile. Sharing the full report now.",
        createdAt: daysAgo(11)
      }
    ]
  },
  {
    id: "task_002",
    projectId: "proj_001",
    title: "Design new homepage hero section",
    description: "Create 3 hero variations in Figma for stakeholder review. Must align with updated brand guide.",
    status: "inReview",
    priority: "urgent",
    assigneeId: "usr_004",
    dueDate: daysFromNow(5),
    createdAt: daysAgo(20),
    subtasks: [
      { id: "st_002a", title: "Review new brand guide", completed: true },
      { id: "st_002b", title: "Create 3 hero variants", completed: true },
      { id: "st_002c", title: "Share for feedback", completed: false }
    ],
    comments: [
      {
        id: "cmt_002",
        userId: "usr_002",
        text: "Variant B is looking strong — can we also try a version with the product screenshot on the right?",
        createdAt: daysAgo(2)
      },
      {
        id: "cmt_003",
        userId: "usr_004",
        text: "On it! Will have it ready by tomorrow morning.",
        createdAt: daysAgo(1)
      }
    ]
  },
  {
    id: "task_003",
    projectId: "proj_001",
    title: "Write copy for About Us page",
    description: "Update team bios and company mission statement. Work with Maria on tone and messaging.",
    status: "inProgress",
    priority: "medium",
    assigneeId: "usr_003",
    dueDate: daysFromNow(10),
    createdAt: daysAgo(15),
    subtasks: [],
    comments: []
  },
  {
    id: "task_004",
    projectId: "proj_002",
    title: "Define v2.0 feature scope",
    description: "Collaborate with engineering leads to finalize the feature list and cut scope that won't be ready for launch.",
    status: "done",
    priority: "urgent",
    assigneeId: "usr_001",
    dueDate: daysAgo(5).split('T')[0],
    createdAt: daysAgo(35),
    subtasks: [
      { id: "st_004a", title: "Engineering sync meeting", completed: true },
      { id: "st_004b", title: "Update feature list in PRD", completed: true }
    ],
    comments: []
  },
  {
    id: "task_005",
    projectId: "proj_002",
    title: "Create launch announcement email",
    description: "Draft the product launch email for existing customers. Target send date: June 10.",
    status: "todo",
    priority: "medium",
    assigneeId: "usr_004",
    dueDate: daysFromNow(60),
    createdAt: daysAgo(10),
    subtasks: [
      { id: "st_005a", title: "Draft copy", completed: false },
      { id: "st_005b", title: "Design email template", completed: false },
      { id: "st_005c", title: "A/B test subject lines", completed: false }
    ],
    comments: []
  },
  {
    id: "task_006",
    projectId: "proj_002",
    title: "Set up analytics tracking for new features",
    description: "Instrument key events in Amplitude — feature adoption, drop-off points, and conversion milestones.",
    status: "inProgress",
    priority: "high",
    assigneeId: "usr_002",
    dueDate: daysFromNow(45),
    createdAt: daysAgo(12),
    subtasks: [],
    comments: []
  },
  {
    id: "task_007",
    projectId: "proj_003",
    title: "Archive deprecated internal scripts",
    description: "Identify scripts not used in the last 6 months and move to /archive with a README explaining the decision.",
    status: "inProgress",
    priority: "low",
    assigneeId: "usr_003",
    dueDate: daysAgo(1).split('T')[0],
    createdAt: daysAgo(25),
    subtasks: [
      { id: "st_007a", title: "Audit script usage logs", completed: true },
      { id: "st_007b", title: "Move to /archive folder", completed: false }
    ],
    comments: []
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif_001",
    userId: "usr_001",
    type: "taskAssigned",
    message: "Maria Chen assigned you to 'Define v2.0 feature scope'",
    relatedTaskId: "task_004",
    read: true,
    createdAt: daysAgo(34)
  },
  {
    id: "notif_002",
    userId: "usr_001",
    type: "comment",
    message: "Priya Nair commented on 'Design new homepage hero section'",
    relatedTaskId: "task_002",
    read: false,
    createdAt: daysAgo(1)
  },
  {
    id: "notif_003",
    userId: "usr_001",
    type: "statusChange",
    message: "James Okafor moved 'Audit current site performance' to Done",
    relatedTaskId: "task_001",
    read: false,
    createdAt: daysAgo(9)
  }
];
