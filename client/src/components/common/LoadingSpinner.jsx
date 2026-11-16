export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      {message && (
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
};
