export const ProgressOverview = ({ stats, tasks }) => {
  const { total, completed, inProgress, todo, completionRate } = stats;

  const getPercentage = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

  // Compute priority distribution from actual database records
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const mediumCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'Low').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Completion Progress Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Task Completion Progress
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time workflow status breakdown
            </p>
          </div>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {completionRate}%
          </span>
        </div>

        {/* Main Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Todo</span>
            </div>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {todo}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({getPercentage(todo)}%)
              </span>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>In Progress</span>
            </div>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {inProgress}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({getPercentage(inProgress)}%)
              </span>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </div>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {completed}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({getPercentage(completed)}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Priority Breakdown Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Priority Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Distribution of tasks by urgency level
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                High Priority
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {highCount} tasks ({getPercentage(highCount)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(highCount)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                Medium Priority
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {mediumCount} tasks ({getPercentage(mediumCount)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(mediumCount)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                Low Priority
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {lowCount} tasks ({getPercentage(lowCount)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-300"
                style={{ width: `${getPercentage(lowCount)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
