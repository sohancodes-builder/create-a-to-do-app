import { Category, Task } from '../types';
import { getTodayString, getTomorrowString } from './date';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work & Projects', color: '#6366f1', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal & Life', color: '#ec4899', icon: 'User' },
  { id: 'study', name: 'Study & Learning', color: '#3b82f6', icon: 'BookOpen' },
  { id: 'health', name: 'Health & Wellness', color: '#10b981', icon: 'Heart' },
  { id: 'finance', name: 'Finance & Bills', color: '#f59e0b', icon: 'DollarSign' },
];

export function getInitialTasks(): Task[] {
  const today = getTodayString();
  const tomorrow = getTomorrowString();

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 4);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  return [
    {
      id: 'task-1',
      title: 'Review Q4 Product Roadmap & Goals',
      description: 'Prepare executive deck with milestone updates, target delivery dates, and resource allocation.',
      completed: false,
      status: 'in-progress',
      priority: 'urgent',
      category: 'work',
      tags: ['strategy', 'roadmap', 'presentation'],
      dueDate: today,
      dueTime: '15:00',
      isStarred: true,
      estimatedMinutes: 50,
      spentMinutes: 25,
      subtasks: [
        { id: 'st-1-1', title: 'Compile sprint velocity data', completed: true },
        { id: 'st-1-2', title: 'Review slide deck design', completed: true },
        { id: 'st-1-3', title: 'Share preview with team lead', completed: false },
      ],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: '30-minute Morning HIIT & Stretching',
      description: 'Cardio routine + mobility exercises to boost morning focus.',
      completed: true,
      completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: 'completed',
      priority: 'medium',
      category: 'health',
      tags: ['fitness', 'routine'],
      dueDate: today,
      dueTime: '08:00',
      isStarred: false,
      estimatedMinutes: 30,
      spentMinutes: 30,
      subtasks: [
        { id: 'st-2-1', title: '5 min dynamic warmup', completed: true },
        { id: 'st-2-2', title: '20 min HIIT circuit', completed: true },
        { id: 'st-2-3', title: '5 min cool down stretch', completed: true },
      ],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'Learn TypeScript 5.5 Inferred Type Predicates',
      description: 'Read the official release blog and experiment with code examples in a sandbox.',
      completed: false,
      status: 'todo',
      priority: 'high',
      category: 'study',
      tags: ['typescript', 'frontend', 'coding'],
      dueDate: tomorrow,
      dueTime: '17:00',
      isStarred: true,
      estimatedMinutes: 45,
      spentMinutes: 0,
      subtasks: [
        { id: 'st-3-1', title: 'Read TypeScript announcement docs', completed: false },
        { id: 'st-3-2', title: 'Write unit tests testing type guards', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: 'Pay monthly broadband and utilities invoice',
      description: 'Download PDF receipt and log into expense tracker.',
      completed: false,
      status: 'todo',
      priority: 'medium',
      category: 'finance',
      tags: ['bills', 'home'],
      dueDate: nextWeekStr,
      dueTime: '12:00',
      isStarred: false,
      estimatedMinutes: 15,
      spentMinutes: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-5',
      title: 'Organize weekend camping gear & groceries',
      description: 'Check sleeping bags, tent stakes, flashlight batteries, and trail snacks.',
      completed: false,
      status: 'todo',
      priority: 'low',
      category: 'personal',
      tags: ['weekend', 'outdoor'],
      dueDate: nextWeekStr,
      isStarred: false,
      estimatedMinutes: 40,
      spentMinutes: 0,
      subtasks: [
        { id: 'st-5-1', title: 'Inspect tent and stakes', completed: false },
        { id: 'st-5-2', title: 'Buy trail mix and electrolytes', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
