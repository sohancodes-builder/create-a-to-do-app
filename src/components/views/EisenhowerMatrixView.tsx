import React from 'react';
import { AlertTriangle, Calendar, Users, Archive, Plus } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../TaskCard';
import { Task } from '../../types';
import { isToday, isOverdue } from '../../utils/date';

export const EisenhowerMatrixView: React.FC = () => {
  const { filteredTasks, openCreateTaskModal } = useTasks();

  // Quadrant classification
  const isUrgent = (t: Task) =>
    t.priority === 'urgent' || (t.dueDate ? isToday(t.dueDate) || isOverdue(t.dueDate, t.completed) : false);

  const isImportant = (t: Task) =>
    t.priority === 'urgent' || t.priority === 'high' || t.isStarred;

  const q1Tasks = filteredTasks.filter((t) => isUrgent(t) && isImportant(t));
  const q2Tasks = filteredTasks.filter((t) => !isUrgent(t) && isImportant(t));
  const q3Tasks = filteredTasks.filter((t) => isUrgent(t) && !isImportant(t));
  const q4Tasks = filteredTasks.filter((t) => !isUrgent(t) && !isImportant(t));

  const quadrants = [
    {
      title: 'Do First',
      subtitle: 'Urgent & Important (Handle immediately)',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      color: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20',
      badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
      tasks: q1Tasks,
      defaultPriority: 'urgent' as const,
    },
    {
      title: 'Schedule',
      subtitle: 'Important, Not Urgent (Plan for long-term impact)',
      icon: <Calendar className="w-4 h-4 text-indigo-500" />,
      color: 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20',
      badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      tasks: q2Tasks,
      defaultPriority: 'high' as const,
    },
    {
      title: 'Delegate / Quick',
      subtitle: 'Urgent, Not Critical (Batch or automate)',
      icon: <Users className="w-4 h-4 text-amber-500" />,
      color: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      tasks: q3Tasks,
      defaultPriority: 'medium' as const,
    },
    {
      title: 'Eliminate / Low Focus',
      subtitle: 'Neither Urgent Nor Important (Review or drop)',
      icon: <Archive className="w-4 h-4 text-slate-500" />,
      color: 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30',
      badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      tasks: q4Tasks,
      defaultPriority: 'low' as const,
    },
  ];

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Eisenhower Matrix
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Prioritize by urgency and impact to maximize your daily effectiveness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q) => (
          <div
            key={q.title}
            className={`rounded-3xl p-4 border ${q.color} flex flex-col min-h-[350px]`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {q.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {q.title}
                    </h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${q.badge}`}>
                      {q.tasks.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {q.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openCreateTaskModal({ priority: q.defaultPriority })}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={`Add task to ${q.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 flex-1">
              {q.tasks.map((task) => (
                <TaskCard key={task.id} task={task} compact={true} />
              ))}
              {q.tasks.length === 0 && (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    No tasks in this quadrant
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
