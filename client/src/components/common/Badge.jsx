/**
 * Reusable Status and Priority Badge Component
 */
export const PriorityBadge = ({ priority }) => {
  const styles = {
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    Medium:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    High: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    Todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    'In Progress':
      'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    Completed:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
  };

  const dotColors = {
    Todo: 'bg-slate-400',
    'In Progress': 'bg-blue-500',
    Completed: 'bg-emerald-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || styles.Todo
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || dotColors.Todo}`} />
      {status}
    </span>
  );
};
