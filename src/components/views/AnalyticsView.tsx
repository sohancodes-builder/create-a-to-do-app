import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Award,
  TrendingUp,
  PieChart,
  BarChart2,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Priority } from '../../types';

export const AnalyticsView: React.FC = () => {
  const { tasks, categories, stats, pomodoro } = useTasks();

  const totalSpentMinutes = tasks.reduce((acc, t) => acc + (t.spentMinutes || 0), 0);
  const spentHours = (totalSpentMinutes / 60).toFixed(1);

  // Breakdown by Priority
  const priorityCounts: Record<Priority, number> = {
    urgent: tasks.filter((t) => t.priority === 'urgent').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length,
  };

  // Breakdown by Category
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat.id);
    const catCompleted = catTasks.filter((t) => t.completed).length;
    return {
      ...cat,
      total: catTasks.length,
      completed: catCompleted,
      rate: catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0,
    };
  });

  return (
    <div className="flex-1 min-w-0 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Productivity Dashboard & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics on your velocity, completion trends, and time investments
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completion Rate
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {stats.rate}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats.rate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {stats.completed} of {stats.total} total tasks finished
          </p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tasks Done
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {stats.completed}
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            {stats.pending} remaining in your active queue
          </p>
        </div>

        {/* Overdue Alert */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overdue
            </span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {stats.overdue}
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            {stats.overdue > 0 ? 'Requires immediate attention' : 'Zero overdue tasks — awesome!'}
          </p>
        </div>

        {/* Pomodoro Focus Time */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Focus Logged
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {spentHours} <span className="text-sm font-normal text-slate-400">hrs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            {pomodoro.sessionsCompleted} Pomodoro sessions completed
          </p>
        </div>
      </div>

      {/* Breakdown Grid: Category Progress & Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Category Completion Rates
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {categories.length} categories
            </span>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-700 dark:text-slate-200 font-semibold">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">
                    {cat.completed}/{cat.total} ({cat.rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.rate}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Task Volume by Priority
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {stats.total} total
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Urgent Priority', key: 'urgent' as const, color: 'bg-rose-500', count: priorityCounts.urgent },
              { label: 'High Priority', key: 'high' as const, color: 'bg-amber-500', count: priorityCounts.high },
              { label: 'Medium Priority', key: 'medium' as const, color: 'bg-indigo-500', count: priorityCounts.medium },
              { label: 'Low Priority', key: 'low' as const, color: 'bg-slate-400', count: priorityCounts.low },
            ].map((p) => {
              const pct = stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0;
              return (
                <div key={p.key}>
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      {p.label}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {p.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${p.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Productivity Tip Card */}
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Pro Productivity Tip
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Break large tasks into 2-4 subtasks and pair them with 25-minute Pomodoro focus blocks to maintain peak mental momentum throughout the day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
