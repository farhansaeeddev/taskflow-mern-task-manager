import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-slate-50 dark:bg-slate-950">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        404 Error
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};
