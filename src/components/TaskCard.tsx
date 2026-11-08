import React, { useState } from 'react';
import {
  Check,
  Star,
  Clock,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Play,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  Circle,
  Tag,
} from 'lucide-react';
import { Task, Priority } from '../types';
import { useTasks } from '../context/TaskContext';
import { getRelativeDateLabel } from '../utils/date';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const {
    categories,
    toggleTaskComplete,
    toggleStarTask,
    deleteTask,
    openEditTaskModal,
    startPomodoroForTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
  } = useTasks();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const category = categories.find((c) => c.id === task.category);
  const dateInfo = getRelativeDateLabel(task.dueDate);

  const priorityConfig: Record<
    Priority,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    urgent: {
      label: 'Urgent',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800/60',
      dot: 'bg-rose-500',
    },
    high: {
      label: 'High',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800/60',
      dot: 'bg-amber-500',
    },
    medium: {
      label: 'Medium',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800/60',
      dot: 'bg-indigo-500',
    },
    low: {
      label: 'Low',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
  };

  const pStyle = priorityConfig[task.priority] || priorityConfig.medium;
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasksCount = task.subtasks?.filter((st) => st.completed).length || 0;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 hover:shadow-md ${
        task.completed
          ? 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 opacity-75'
          : dateInfo.isOverdue
          ? 'border-rose-300 dark:border-rose-900/60 shadow-sm'
          : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700/60'
      }`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleTaskComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${
            task.completed
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400'
          }`}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              onClick={() => openEditTaskModal(task)}
              className={`text-sm font-semibold tracking-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            {/* Star & Action Menu */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleStarTask(task.id)}
                className={`p-1 rounded-lg transition-colors ${
                  task.isStarred
                    ? 'text-amber-400 hover:text-amber-500'
                    : 'text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-500'
                }`}
                title={task.isStarred ? 'Unstar' : 'Star'}
              >
                <Star
                  className={`w-4 h-4 ${task.isStarred ? 'fill-amber-400' : ''}`}
                />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-30 text-xs">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          openEditTaskModal(task);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Task</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          startPomodoroForTask(task.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Focus Timer</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          deleteTask(task.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description Snippet */}
          {task.description && !compact && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Metadata Badges (Category, Priority, Due Date, Subtasks) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
            {/* Category */}
            {category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            )}

            {/* Priority */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
              {pStyle.label}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
                  dateInfo.isOverdue
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{dateInfo.label}</span>
                {task.dueTime && <span>at {task.dueTime}</span>}
              </span>
            )}

            {/* Subtasks Count & Quick Expand Toggle */}
            {subtasksCount > 0 && (
              <button
                onClick={() => setIsExpanded((v) => !v)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                <span>
                  {completedSubtasksCount}/{subtasksCount}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Pomodoro Focus Action */}
            <button
              onClick={() => startPomodoroForTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-medium ml-auto"
              title="Start Pomodoro focus session"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>Focus</span>
            </button>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Expandable Subtask List */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Checklist</span>
                <span className="font-mono text-[10px]">
                  {Math.round((completedSubtasksCount / (subtasksCount || 1)) * 100)}%
                </span>
              </div>

              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 group/st text-xs"
                >
                  <button
                    onClick={() => toggleSubtask(task.id, st.id)}
                    className="flex items-center gap-2 text-left flex-1"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        st.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                      }
                    >
                      {st.title}
                    </span>
                  </button>

                  <button
                    onClick={() => deleteSubtask(task.id, st.id)}
                    className="opacity-0 group-hover/st:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-opacity"
                    title="Delete subtask"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add subtask inline */}
              {isAddingSubtask ? (
                <form onSubmit={handleAddSubtaskSubmit} className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="New subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-indigo-600 text-white text-xs rounded-lg font-medium hover:bg-indigo-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSubtask(false)}
                    className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingSubtask(true)}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline pt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add item</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
