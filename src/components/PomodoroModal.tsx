import React from 'react';
import { X, Play, Pause, RotateCcw, Coffee, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const PomodoroModal: React.FC = () => {
  const {
    isPomodoroOpen,
    setIsPomodoroOpen,
    pomodoro,
    setPomodoro,
    tasks,
    toggleTaskComplete,
  } = useTasks();

  if (!isPomodoroOpen) return null;

  const currentTask = tasks.find((t) => t.id === pomodoro.taskId);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    setPomodoro((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleResetTimer = () => {
    setPomodoro((prev) => ({
      ...prev,
      isActive: false,
      timeLeft: prev.totalTime,
    }));
  };

  const setMode = (mode: 'work' | 'shortBreak' | 'longBreak', minutes: number) => {
    const totalSecs = minutes * 60;
    setPomodoro((prev) => ({
      ...prev,
      mode,
      isActive: false,
      timeLeft: totalSecs,
      totalTime: totalSecs,
    }));
  };

  const progressPercent = ((pomodoro.totalTime - pomodoro.timeLeft) / pomodoro.totalTime) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 relative overflow-hidden flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsPomodoroOpen(false)}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 mt-1">
          <button
            onClick={() => setMode('work', 25)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              pomodoro.mode === 'work'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Focus (25m)</span>
          </button>

          <button
            onClick={() => setMode('shortBreak', 5)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              pomodoro.mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break (5m)</span>
          </button>

          <button
            onClick={() => setMode('longBreak', 15)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              pomodoro.mode === 'longBreak'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Long (15m)</span>
          </button>
        </div>

        {/* Big Circular Clock UI */}
        <div className="relative w-48 h-48 my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`${
                pomodoro.mode === 'work'
                  ? 'text-indigo-600'
                  : pomodoro.mode === 'shortBreak'
                  ? 'text-emerald-500'
                  : 'text-purple-600'
              } transition-all duration-500`}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Time digits inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {formatTime(pomodoro.timeLeft)}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
              {pomodoro.mode === 'work' ? 'Deep Work' : 'Rest & Recharge'}
            </span>
          </div>
        </div>

        {/* Attached Task Selector */}
        <div className="w-full my-4 px-2">
          <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 text-left">
            Active Task Focus
          </label>
          <select
            value={pomodoro.taskId || ''}
            onChange={(e) =>
              setPomodoro((prev) => ({
                ...prev,
                taskId: e.target.value || null,
              }))
            }
            className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">(No specific task selected)</option>
            {tasks
              .filter((t) => !t.completed)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
          </select>

          {currentTask && (
            <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 text-xs text-left">
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2">
                {currentTask.title}
              </span>
              <button
                onClick={() => toggleTaskComplete(currentTask.id)}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Done</span>
              </button>
            </div>
          )}
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleResetTimer}
            title="Reset timer"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleTimer}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 ${
              pomodoro.isActive
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
            }`}
          >
            {pomodoro.isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Session</span>
              </>
            )}
          </button>
        </div>

        {/* Stats footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-around text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="block font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
              {pomodoro.sessionsCompleted}
            </span>
            <span>Sessions Today</span>
          </div>
          <div>
            <span className="block font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
              {pomodoro.sessionsCompleted * 25}m
            </span>
            <span>Total Focus Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
