import { useLocation } from 'react-router-dom';
import { Icons } from '../common/Icons';
import { useTheme } from '../../hooks/useTheme';

export const Navbar = ({ onOpenSidebar, onOpenCreateModal }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageHeader = () => {
    if (location.pathname.startsWith('/tasks')) {
      return {
        title: 'Task Directory',
        subtitle: 'Search, filter, and manage all your tasks in list view',
      };
    }
    if (location.pathname.startsWith('/kanban')) {
      return {
        title: 'Kanban Board',
        subtitle: 'Track workflow across Todo, In Progress, and Completed columns',
      };
    }
    return {
      title: 'Workspace Overview',
      subtitle: 'Real-time metrics and task progress across your account',
    };
  };

  const { title, subtitle } = getPageHeader();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Icons.Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Icons.Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Icons.Moon className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
        >
          <Icons.Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
};
