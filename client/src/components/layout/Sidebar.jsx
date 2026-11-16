import { NavLink } from 'react-router-dom';
import { Icons } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';

export const Sidebar = ({ isOpen, onClose, onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const { stats } = useTasks();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Icons.Dashboard,
      badge: null,
    },
    {
      name: 'Tasks List',
      path: '/tasks',
      icon: Icons.List,
      badge: stats.total,
    },
    {
      name: 'Kanban Board',
      path: '/kanban',
      icon: Icons.Kanban,
      badge: stats.inProgress > 0 ? `${stats.inProgress} active` : null,
    },
  ];

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Icons.Logo className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
              <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 -mt-0.5">
                MERN Workspace
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            aria-label="Close sidebar"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              onOpenCreateModal();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-xs transition-colors"
          >
            <Icons.Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspace
          </p>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Quick Workspace Summary Card */}
          <div className="mt-6 mx-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              <span>Completion Rate</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {stats.completionRate}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center justify-center shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
              aria-label="Log out"
            >
              <Icons.Logout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
