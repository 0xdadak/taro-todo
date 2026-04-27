export interface User {
  id: string;
  openId: string;
  unionId?: string;
  nickname?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  reminder?: Date;
  tags: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface DailyStats {
  date: Date;
  userId: string;
  totalTasks: number;
  completedTasks: number;
  incompleteTasks: number;
  completionRate: number;
}

export interface JwtPayload {
  userId: string;
  openId: string;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
