import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, MoreHorizontal } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from '../TaskCard';

export const KanbanView: React.FC = () => {
  const { filteredTasks, moveTaskStatus, openCreateTaskModal } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns: { id: TaskStatus; title: string; color: string; icon: React.ReactNode }[] = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-slate-500',
      icon: <Circle className="w-4 h-4 text-slate-500" />,
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-indigo-500',
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, newStatus);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Drag and drop tasks between columns to update their workflow status
          </p>
        </div>
      </div>

      {/* Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-slate-100/70 dark:bg-slate-900/40 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 tracking-tight">
                    {col.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => openCreateTaskModal({ status: col.id })}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards Column Body */}
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing transition-transform"
                  >
                    <TaskCard task={task} compact={true} />
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Drop tasks here or click +
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
