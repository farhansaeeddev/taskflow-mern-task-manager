import { Modal } from '../common/Modal';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { Icons } from '../common/Icons';

export const TaskDetailModal = ({ task, isOpen, onClose, onEdit, onDelete }) => {
  if (!task) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" maxWidth="max-w-lg">
      <div className="space-y-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Icons.Tag className="w-3 h-3" />
              {task.category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {task.title}
          </h3>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Description
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 block mb-0.5">
              Due Date
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(task.dueDate)}
            </span>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 block mb-0.5">
              Created Date
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
          >
            <Icons.Trash className="w-4 h-4" />
            Delete Task
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Icons.Edit className="w-3.5 h-3.5" />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
