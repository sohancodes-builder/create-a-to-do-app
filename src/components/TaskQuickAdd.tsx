import React, { useState } from 'react';
import { Plus, Calendar, Tag, Flag, ArrowRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { Priority } from '../types';
import { getTodayString, getTomorrowString } from '../utils/date';

export const TaskQuickAdd: React.FC = () => {
  const { addTask, categories, activeFilter } = useTasks();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [category, setCategory] = useState<string>(categories[0]?.id || 'work');
  const [isExpanded, setIsExpanded] = useState(false);

  // If currently filtering by category, default quick-add to that category
  React.useEffect(() => {
    if (typeof activeFilter === 'object' && activeFilter.type === 'category') {
      setCategory(activeFilter.value);
    }
  }, [activeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      priority,
      dueDate: dueDate || null,
      category,
    });

    setTitle('');
    setDueDate('');
    setPriority('medium');
    setIsExpanded(false);
  };

  const setDateToday = () => setDueDate(getTodayString());
  const setDateTomorrow = () => setDueDate(getTomorrowString());

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all focus-within:shadow-md focus-within:border-indigo-400 dark:focus-within:border-indigo-600 mb-6">
      <form onSubmit={handleSubmit} className="p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Plus className="w-4 h-4" />
          </div>

          <input
            type="text"
            placeholder="Add a new task... (press Enter to save)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 bg-transparent text-sm sm:text-base font-medium placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!title.trim()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <span>Add</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Left Controls: Priority, Date, Category */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category picker */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border-0 focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Priority picker */}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border-0 focus:ring-1 focus:ring-indigo-500 text-xs font-medium"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>

              {/* Due Date picker or quick tags */}
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg border-0 focus:ring-1 focus:ring-indigo-500 text-xs"
                />
                {!dueDate && (
                  <>
                    <button
                      type="button"
                      onClick={setDateToday}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={setDateTomorrow}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                    >
                      Tomorrow
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Close
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
