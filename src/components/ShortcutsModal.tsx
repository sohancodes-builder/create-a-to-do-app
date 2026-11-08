import React from 'react';
import { X, Command } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useTasks();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'N', desc: 'Create a new task' },
    { key: 'Ctrl / Cmd + K', desc: 'Search tasks instantly' },
    { key: 'P', desc: 'Open Pomodoro Focus Timer' },
    { key: '1', desc: 'Switch to List View' },
    { key: '2', desc: 'Switch to Kanban Board View' },
    { key: '3', desc: 'Switch to Eisenhower Matrix' },
    { key: '4', desc: 'Switch to Calendar View' },
    { key: '5', desc: 'Switch to Productivity Stats' },
    { key: 'D', desc: 'Toggle Dark / Light Mode' },
    { key: 'M', desc: 'Toggle Audio Effects' },
    { key: 'Esc', desc: 'Close any open modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Command className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
          </div>

          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {s.desc}
              </span>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Press any shortcut key directly while browsing your tasks
          </p>
        </div>
      </div>
    </div>
  );
};
