import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ActiveFilter, Category, FilterOptions, PomodoroState, Priority, Task, TaskStatus, ViewMode } from '../types';
import { DEFAULT_CATEGORIES, getInitialTasks } from '../utils/initialData';
import { playCompleteSound, playUncompleteSound, playPomodoroBell } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { isToday, isOverdue } from '../utils/date';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  activeFilter: ActiveFilter;
  filterOptions: FilterOptions;
  viewMode: ViewMode;
  soundEnabled: boolean;
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  pomodoro: PomodoroState;
  isPomodoroOpen: boolean;
  isShortcutsOpen: boolean;
  isBackupOpen: boolean;
  
  // Modals & Navigation
  setViewMode: (mode: ViewMode) => void;
  setActiveFilter: (filter: ActiveFilter) => void;
  setFilterOptions: (updater: Partial<FilterOptions> | ((prev: FilterOptions) => FilterOptions)) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  openCreateTaskModal: (defaults?: Partial<Task>) => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  setIsPomodoroOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShortcutsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBackupOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Task actions
  addTask: (data: Partial<Task> & { title: string }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleStarTask: (id: string) => void;
  moveTaskStatus: (id: string, status: TaskStatus) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Category actions
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  // Pomodoro
  startPomodoroForTask: (taskId: string) => void;
  setPomodoro: React.Dispatch<React.SetStateAction<PomodoroState>>;

  // Bulk & Data Management
  clearCompletedTasks: () => void;
  resetToDemoData: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;

  // Derived state
  filteredTasks: Task[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    todayTasksCount: number;
    todayCompletedCount: number;
    rate: number;
  };
  allTags: string[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  CATEGORIES: 'taskflow_categories_v1',
  SOUND: 'taskflow_sound_enabled',
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return getInitialTasks();
  });

  // Load categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  // Navigation & View state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [filterOptions, setFilterOptionsState] = useState<FilterOptions>({
    search: '',
    priority: 'all',
    category: 'all',
    status: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Pomodoro state
  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    isActive: false,
    mode: 'work',
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    taskId: null,
    sessionsCompleted: 0,
  });

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks', e);
    }
  }, [tasks]);

  // Save categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories', e);
    }
  }, [categories]);

  // Save sound setting
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
  }, [soundEnabled]);

  // Pomodoro timer tick effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (pomodoro.isActive && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro((prev) => {
          if (prev.timeLeft <= 1) {
            playPomodoroBell(soundEnabled);
            fireConfetti();
            
            const nextMode = prev.mode === 'work' ? 'shortBreak' : 'work';
            const nextDuration = nextMode === 'work' ? 25 * 60 : 5 * 60;
            
            // If finishing work mode with an assigned task, increment its spentMinutes
            if (prev.mode === 'work' && prev.taskId) {
              setTasks((currentTasks) =>
                currentTasks.map((t) =>
                  t.id === prev.taskId
                    ? { ...t, spentMinutes: (t.spentMinutes || 0) + 25 }
                    : t
                )
              );
            }

            return {
              ...prev,
              isActive: false,
              mode: nextMode,
              timeLeft: nextDuration,
              totalTime: nextDuration,
              sessionsCompleted: prev.mode === 'work' ? prev.sessionsCompleted + 1 : prev.sessionsCompleted,
            };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoro.isActive, pomodoro.timeLeft, pomodoro.mode, pomodoro.taskId, soundEnabled]);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const setFilterOptions = (
    updater: Partial<FilterOptions> | ((prev: FilterOptions) => FilterOptions)
  ) => {
    setFilterOptionsState((prev) => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  };

  const openCreateTaskModal = (defaults?: Partial<Task>) => {
    if (defaults) {
      setEditingTask({
        id: '',
        title: defaults.title || '',
        description: defaults.description || '',
        completed: false,
        status: defaults.status || 'todo',
        priority: defaults.priority || 'medium',
        category: defaults.category || (categories[0]?.id || 'work'),
        tags: defaults.tags || [],
        dueDate: defaults.dueDate || null,
        dueTime: defaults.dueTime || null,
        subtasks: defaults.subtasks || [],
        estimatedMinutes: defaults.estimatedMinutes || 25,
        spentMinutes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      setEditingTask(null);
    }
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const addTask = (data: Partial<Task> & { title: string }): Task => {
    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: data.description || '',
      completed: false,
      completedAt: null,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      category: data.category || (categories[0]?.id || 'work'),
      tags: data.tags || [],
      dueDate: data.dueDate || null,
      dueTime: data.dueTime || null,
      subtasks: data.subtasks || [],
      isStarred: data.isStarred || false,
      estimatedMinutes: data.estimatedMinutes || 25,
      spentMinutes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          // Synchronize completed state with status
          if (updates.status && updates.status === 'completed' && !t.completed) {
            updated.completed = true;
            updated.completedAt = new Date().toISOString();
          } else if (updates.status && updates.status !== 'completed' && t.completed) {
            updated.completed = false;
            updated.completedAt = null;
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (pomodoro.taskId === id) {
      setPomodoro((prev) => ({ ...prev, taskId: null }));
    }
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newCompleted = !t.completed;
          if (newCompleted) {
            playCompleteSound(soundEnabled);
            fireConfetti();
          } else {
            playUncompleteSound(soundEnabled);
          }
          return {
            ...t,
            completed: newCompleted,
            status: newCompleted ? 'completed' : 'todo',
            completedAt: newCompleted ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const toggleStarTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isStarred: !t.isStarred } : t))
    );
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isNowCompleted = newStatus === 'completed';
          if (isNowCompleted && !t.completed) {
            playCompleteSound(soundEnabled);
            fireConfetti();
          }
          return {
            ...t,
            status: newStatus,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? (t.completedAt || new Date().toISOString()) : null,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSub: { id: string; title: string; completed: boolean } = {
      id: 'st_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      completed: false,
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSub] } : t))
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) };
        }
        return t;
      })
    );
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const startPomodoroForTask = (taskId: string) => {
    setPomodoro((prev) => ({
      ...prev,
      taskId,
      mode: 'work',
      timeLeft: 25 * 60,
      totalTime: 25 * 60,
      isActive: true,
    }));
    setIsPomodoroOpen(true);
  };

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const resetToDemoData = () => {
    const demo = getInitialTasks();
    setTasks(demo);
    setCategories(DEFAULT_CATEGORIES);
  };

  const exportData = (): string => {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
        if (Array.isArray(parsed.categories)) {
          setCategories(parsed.categories);
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON', e);
    }
    return false;
  };

  // Derive unique tags from all tasks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((t) => {
      t.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  // Derived filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Active Filter Navigation
        if (activeFilter === 'today') {
          if (!isToday(task.dueDate)) return false;
        } else if (activeFilter === 'upcoming') {
          if (!task.dueDate || isToday(task.dueDate) || isOverdue(task.dueDate, task.completed)) return false;
        } else if (activeFilter === 'starred') {
          if (!task.isStarred) return false;
        } else if (activeFilter === 'completed') {
          if (!task.completed) return false;
        } else if (typeof activeFilter === 'object') {
          if (activeFilter.type === 'category' && task.category !== activeFilter.value) {
            return false;
          }
          if (activeFilter.type === 'tag' && !task.tags.includes(activeFilter.value)) {
            return false;
          }
        }

        // Secondary Filters
        if (filterOptions.search) {
          const query = filterOptions.search.toLowerCase().trim();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description?.toLowerCase().includes(query);
          const matchTag = task.tags.some((tg) => tg.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchTag) return false;
        }

        if (filterOptions.priority !== 'all' && task.priority !== filterOptions.priority) {
          return false;
        }

        if (filterOptions.category !== 'all' && task.category !== filterOptions.category) {
          return false;
        }

        if (filterOptions.status !== 'all' && task.status !== filterOptions.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const order = filterOptions.sortOrder === 'asc' ? 1 : -1;
        
        if (filterOptions.sortBy === 'dueDate') {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate) * order;
        }

        if (filterOptions.sortBy === 'priority') {
          const pMap: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (pMap[b.priority] - pMap[a.priority]) * order;
        }

        if (filterOptions.sortBy === 'title') {
          return a.title.localeCompare(b.title) * order;
        }

        if (filterOptions.sortBy === 'subtasks') {
          return (a.subtasks.length - b.subtasks.length) * order;
        }

        // Default 'createdAt'
        return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * order;
      });
  }, [tasks, activeFilter, filterOptions]);

  // Derive stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;
    
    const todayTasks = tasks.filter((t) => isToday(t.dueDate));
    const todayTasksCount = todayTasks.length;
    const todayCompletedCount = todayTasks.filter((t) => t.completed).length;

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      todayTasksCount,
      todayCompletedCount,
      rate,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        activeFilter,
        filterOptions,
        viewMode,
        soundEnabled,
        isTaskModalOpen,
        editingTask,
        pomodoro,
        isPomodoroOpen,
        isShortcutsOpen,
        isBackupOpen,
        setViewMode,
        setActiveFilter,
        setFilterOptions,
        setSoundEnabled,
        toggleSound,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        setIsPomodoroOpen,
        setIsShortcutsOpen,
        setIsBackupOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleStarTask,
        moveTaskStatus,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        addCategory,
        deleteCategory,
        startPomodoroForTask,
        setPomodoro,
        clearCompletedTasks,
        resetToDemoData,
        exportData,
        importData,
        filteredTasks,
        stats,
        allTags,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
