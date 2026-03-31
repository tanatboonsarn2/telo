export type UserRole = 'admin' | 'manager' | 'member';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
}

export type ProjectStatus = 'active' | 'archived';

export interface ProjectStats {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
}

export interface ProjectColumn {
  id: string;
  title: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  status: ProjectStatus;
  dueDate: string;
  createdAt: string;
  taskStats: ProjectStats;
  columns: ProjectColumn[];
}

export type TaskStatus = string;
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  subtasks: Subtask[];
  comments: Comment[];
}

export type NotificationType = 'taskAssigned' | 'comment' | 'statusChange';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  relatedTaskId: string;
  read: boolean;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  logoUrl?: string;
  ownerId: string;
}
