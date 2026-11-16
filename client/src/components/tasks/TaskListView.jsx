import { PriorityBadge, StatusBadge } from '../common/Badge';
import { Icons } from '../common/Icons';

export const TaskListView = ({
  tasks,
  onEdit,
  onDelete,
  onSelectTask,
  onStatusChange,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 pl-5 pr-3 w-10">Done</th>
              <th className="py-3.5 px-4">Task Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 pl-4 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {tasks.map((task) => {
              const completed = task.status === 'Completed';
              const overdue = isOverdue(task);

              return (
                <tr
                  key={task._id}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Quick Complete Toggle */}
                  <td className="py-4 pl-5 pr-3 align-top">
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={() =>
                        onStatusChange(
                          task._id,
                          completed ? 'Todo' : 'Completed'
                        )
                      }
                      aria-label={`Mark "${task.title}" as ${
                        completed ? 'incomplete' : 'completed'
                      }`}
                      className="w-4 h-4 mt-1 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>

                  {/* Title & Description */}
                  <td className="py-4 px-4 align-top max-w-md">
                    <button
                      type="button"
                      onClick={() => onSelectTask(task)}
                      className={`text-left font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                        completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </button>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      Created {formatDate(task.createdAt)}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {task.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Interactive Status Select */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <select
                      aria-label={`Change status for ${task.title}`}
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-4 align-top whitespace-nowrap text-xs">
                    <span
                      className={
                        overdue
                          ? 'font-semibold text-rose-600 dark:text-rose-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }
                    >
                      {formatDate(task.dueDate)}
                      {overdue && ' (Overdue)'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-4 pr-5 align-top whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50 transition-colors"
                        title="Edit task"
                        aria-label={`Edit ${task.title}`}
                      >
                        <Icons.Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete task"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Icons.Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
