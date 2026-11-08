export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string | null;
  status: TaskStatus;
  priority: Priority;
  category: string;
  tags: string[];
  dueDate?: string | null; // YYYY-MM-DD
  dueTime?: string | null; // HH:mm
  subtasks: SubTask[];
  isStarred?: boolean;
  estimatedMinutes?: number;
  spentMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type ViewMode = 'list' | 'kanban' | 'matrix' | 'calendar' | 'analytics';

export type ActiveFilter =
  | 'all'
  | 'today'
  | 'upcoming'
  | 'starred'
  | 'completed'
  | { type: 'category'; value: string }
  | { type: 'tag'; value: string };

export type SortBy = 'dueDate' | 'priority' | 'createdAt' | 'title' | 'subtasks';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  priority: Priority | 'all';
  category: string | 'all';
  status: TaskStatus | 'all';
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface PomodoroState {
  isActive: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  taskId: string | null;
  sessionsCompleted: number;
}
