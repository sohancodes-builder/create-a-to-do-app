import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Trash2,
  FolderOpen,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../TaskCard';
import { TaskQuickAdd } from '../TaskQuickAdd';
import { Priority, SortBy, Task, TaskStatus } from '../../types';

export const ListView: React.FC = () => {
  const {
    filteredTasks,
    categories,
    filterOptions,
    setFilterOptions,
    clearCompletedTasks,
    openCreateTaskModal,
    activeFilter,
  } = useTasks();

  const [groupBy, setGroupBy] = useState<'none' | 'category' | 'priority' | 'status'>('none');

  // Title for current view
  const getFilterHeading = () => {
    if (activeFilter === 'all') return 'All Tasks';
    if (activeFilter === 'today') return "Today's Tasks";
    if (activeFilter === 'upcoming') return 'Upcoming Tasks';
    if (activeFilter === 'starred') return 'Starred Tasks';
    if (activeFilter === 'completed') return 'Completed Archive';
    if (typeof activeFilter === 'object') {
      if (activeFilter.type === 'category') {
        const cat = categories.find((c) => c.id === activeFilter.value);
        return cat ? `${cat.name} Tasks` : 'Category Tasks';
      }
      if (activeFilter.type === 'tag') {
        return `Tagged #${activeFilter.value}`;
      }
    }
    return 'Tasks';
  };

  const completedCountInFiltered = filteredTasks.filter((t) => t.completed).length;

  return (
    <div className="flex-1 min-w-0">
      {/* View Header with Title and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getFilterHeading()}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
            {completedCountInFiltered > 0 && ` • ${completedCountInFiltered} completed`}
          </p>
        </div>

        {/* Action buttons (Clear completed, etc.) */}
        <div className="flex items-center gap-2">
          {completedCountInFiltered > 0 && (
            <button
              onClick={clearCompletedTasks}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Completed</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Bar */}
      <TaskQuickAdd />

      {/* Filter and Sort Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Group By Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Group:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg border-0 focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="none">None</option>
              <option value="category">Category</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={filterOptions.priority}
              onChange={(e) => setFilterOptions({ priority: e.target.value as Priority | 'all' })}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg border-0 focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={filterOptions.category}
              onChange={(e) => setFilterOptions({ category: e.target.value })}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg border-0 focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>
          <select
            value={filterOptions.sortBy}
            onChange={(e) => setFilterOptions({ sortBy: e.target.value as SortBy })}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg border-0 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title (A-Z)</option>
            <option value="subtasks">Subtasks Count</option>
          </select>
          <button
            onClick={() =>
              setFilterOptions({
                sortOrder: filterOptions.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-mono font-bold"
            title={`Sort ${filterOptions.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {filterOptions.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Task List Render */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500 mb-3">
            <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No tasks found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            All caught up or nothing matched your current filter criteria. Take a breather or add a new task!
          </p>
          <button
            onClick={() => openCreateTaskModal()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      ) : groupBy === 'none' ? (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : groupBy === 'category' ? (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catTasks = filteredTasks.filter((t) => t.category === cat.id);
            if (catTasks.length === 0) return null;
            return (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {cat.name} ({catTasks.length})
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {catTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : groupBy === 'priority' ? (
        <div className="space-y-6">
          {(['urgent', 'high', 'medium', 'low'] as Priority[]).map((p) => {
            const pTasks = filteredTasks.filter((t) => t.priority === p);
            if (pTasks.length === 0) return null;
            return (
              <div key={p} className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
                  {p} Priority ({pTasks.length})
                </h3>
                <div className="space-y-2.5">
                  {pTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {(['todo', 'in-progress', 'completed'] as TaskStatus[]).map((st) => {
            const stTasks = filteredTasks.filter((t) => t.status === st);
            if (stTasks.length === 0) return null;
            return (
              <div key={st} className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
                  {st === 'todo' ? 'To Do' : st === 'in-progress' ? 'In Progress' : 'Completed'} (
                  {stTasks.length})
                </h3>
                <div className="space-y-2.5">
                  {stTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
