import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ListView } from './components/views/ListView';
import { KanbanView } from './components/views/KanbanView';
import { EisenhowerMatrixView } from './components/views/EisenhowerMatrixView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { PomodoroModal } from './components/PomodoroModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ImportExportModal } from './components/ImportExportModal';
import { useTasks } from './context/TaskContext';
import { useTheme } from './context/ThemeContext';

export const AppContent: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    openCreateTaskModal,
    closeTaskModal,
    isTaskModalOpen,
    isPomodoroOpen,
    setIsPomodoroOpen,
    isShortcutsOpen,
    setIsShortcutsOpen,
    isBackupOpen,
    setIsBackupOpen,
    toggleSound,
  } = useTasks();

  const { toggleTheme } = useTheme();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Handle Escape anywhere to close modals
      if (e.key === 'Escape') {
        if (isTaskModalOpen) closeTaskModal();
        if (isPomodoroOpen) setIsPomodoroOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isBackupOpen) setIsBackupOpen(false);
        return;
      }

      // Handle Ctrl+K or Cmd+K or / to focus search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        searchInput?.focus();
        return;
      }

      if (isInput) return;

      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        searchInput?.focus();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openCreateTaskModal();
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPomodoroOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleSound();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === '1') {
        setViewMode('list');
      } else if (e.key === '2') {
        setViewMode('kanban');
      } else if (e.key === '3') {
        setViewMode('matrix');
      } else if (e.key === '4') {
        setViewMode('calendar');
      } else if (e.key === '5') {
        setViewMode('analytics');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isTaskModalOpen,
    isPomodoroOpen,
    isShortcutsOpen,
    isBackupOpen,
    openCreateTaskModal,
    closeTaskModal,
    setIsPomodoroOpen,
    setIsShortcutsOpen,
    setIsBackupOpen,
    toggleTheme,
    toggleSound,
    setViewMode,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        <Sidebar />

        <div className="flex-1 min-w-0">
          {viewMode === 'list' && <ListView />}
          {viewMode === 'kanban' && <KanbanView />}
          {viewMode === 'matrix' && <EisenhowerMatrixView />}
          {viewMode === 'calendar' && <CalendarView />}
          {viewMode === 'analytics' && <AnalyticsView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TaskFlow — Smart To-Do & Productivity Workspace</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Press <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">N</kbd> for new task</span>
            <span>Press <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">?</kbd> for shortcuts</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <TaskModal />
      <PomodoroModal />
      <ShortcutsModal />
      <ImportExportModal />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
