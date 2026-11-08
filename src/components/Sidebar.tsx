import React, { useState } from 'react';
import {
  Inbox,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  Folder,
  Tag,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { ActiveFilter, Category } from '../types';

export const Sidebar: React.FC = () => {
  const {
    tasks,
    categories,
    activeFilter,
    setActiveFilter,
    stats,
    allTags,
    addCategory,
    deleteCategory,
  } = useTasks();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  const mainFilters: { id: ActiveFilter; label: string; icon: React.ReactNode; count: number; color?: string }[] = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: <Inbox className="w-4 h-4 text-indigo-500" />,
      count: stats.total,
    },
    {
      id: 'today',
      label: 'Today',
      icon: <Calendar className="w-4 h-4 text-emerald-500" />,
      count: stats.todayTasksCount,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      count: tasks.filter((t) => t.dueDate && !t.completed).length,
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />,
      count: tasks.filter((t) => t.isStarred).length,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
      count: stats.completed,
    },
  ];

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: Category = {
      id: id + '_' + Date.now().toString(36),
      name: newCatName.trim(),
      color: newCatColor,
      icon: 'Folder',
    };

    addCategory(newCat);
    setNewCatName('');
    setIsAddingCategory(false);
  };

  const getCategoryCount = (catId: string) => {
    return tasks.filter((t) => t.category === catId).length;
  };

  const getTagCount = (tagName: string) => {
    return tasks.filter((t) => t.tags?.includes(tagName)).length;
  };

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6 p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Today's Goal Progress Box */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Today's Progress</span>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {stats.todayTasksCount > 0
              ? `${Math.round((stats.todayCompletedCount / stats.todayTasksCount) * 100)}%`
              : '0%'}
          </span>
        </div>
        <div className="w-full bg-indigo-200/50 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${stats.todayTasksCount > 0 ? (stats.todayCompletedCount / stats.todayTasksCount) * 100 : 0}%`,
            }}
          />
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          {stats.todayCompletedCount} of {stats.todayTasksCount} completed today
        </p>
      </div>

      {/* Main Filter Navigation */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5">
          Focus
        </div>
        <nav className="flex flex-col space-y-0.5">
          {mainFilters.map((f) => {
            const isCurrent = activeFilter === f.id;
            return (
              <button
                key={typeof f.id === 'string' ? f.id : 'filter'}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {f.icon}
                  <span>{f.label}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                    isCurrent
                      ? 'bg-indigo-200/50 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Projects & Categories
          </span>
          <button
            onClick={() => setIsAddingCategory((v) => !v)}
            title="Add Category"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Category inline form */}
        {isAddingCategory && (
          <form onSubmit={handleCreateCategory} className="p-2 mb-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="Category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCatColor(color)}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      newCatColor === color ? 'scale-125 ring-2 ring-indigo-500 ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-[11px] bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="flex flex-col space-y-0.5">
          {categories.map((c) => {
            const isCurrent =
              typeof activeFilter === 'object' &&
              activeFilter.type === 'category' &&
              activeFilter.value === c.id;

            return (
              <div
                key={c.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <button
                  onClick={() => setActiveFilter({ type: 'category', value: c.id })}
                  className="flex items-center gap-2.5 flex-1 text-left truncate"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="truncate">{c.name}</span>
                </button>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {getCategoryCount(c.id)}
                  </span>
                  {categories.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity"
                      title="Delete category"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2 flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {allTags.map((tag) => {
              const isCurrent =
                typeof activeFilter === 'object' &&
                activeFilter.type === 'tag' &&
                activeFilter.value === tag;

              return (
                <button
                  key={tag}
                  onClick={() =>
                    setActiveFilter(isCurrent ? 'all' : { type: 'tag', value: tag })
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>#{tag}</span>
                  <span className="opacity-75 text-[9px] font-mono">({getTagCount(tag)})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
