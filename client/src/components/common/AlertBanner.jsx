import { Icons } from './Icons';

export const AlertBanner = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  const containerClasses = isError
    ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-200'
    : isSuccess
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-800 dark:text-emerald-200'
    : 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/70 dark:border-indigo-800 dark:text-indigo-200';

  return (
    <div
      role="alert"
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-sm ${containerClasses}`}
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? (
          <Icons.CheckCircle className="w-5 h-5 shrink-0" />
        ) : (
          <Icons.AlertCircle className="w-5 h-5 shrink-0" />
        )}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <Icons.Close className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
