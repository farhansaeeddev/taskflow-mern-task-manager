export const StatCard = ({ title, value, subtitle, icon: IconComponent, accentColor = 'indigo' }) => {
  const colorMap = {
    indigo:
      'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    emerald:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber:
      'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    blue:
      'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    rose:
      'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {IconComponent && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              colorMap[accentColor] || colorMap.indigo
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
