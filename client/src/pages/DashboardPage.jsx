import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { StatCard } from '../components/dashboard/StatCard';
import { ProgressOverview } from '../components/dashboard/ProgressOverview';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Icons } from '../components/common/Icons';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, error, changeTaskStatus, deleteTask } = useTasks();
  const { openCreateModal, openEditModal } = useOutletContext();

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const recentTasks = tasks.slice(0, 6);

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    await deleteTask(taskToDelete._id);
    setIsDeleting(false);
    setTaskToDelete(null);
  };

  if (loading && tasks.length === 0) {
    return <LoadingSpinner message="Loading your dashboard metrics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            You have{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {stats.pending} pending {stats.pending === 1 ? 'task' : 'tasks'}
            </span>{' '}
            and{' '}
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {stats.highPriority} high priority {stats.highPriority === 1 ? 'item' : 'items'}
            </span>{' '}
            in your workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/kanban"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Icons.Kanban className="w-4 h-4" />
            Open Kanban
          </Link>
          <button
            type="button"
            onClick={() => openCreateModal('Todo')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Icons.Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* 5 Key Statistics Cards (Calculated from real MongoDB records) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          subtitle="All workspace tasks"
          icon={Icons.List}
          accentColor="indigo"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completed}
          subtitle={`${stats.completionRate}% completion rate`}
          icon={Icons.CheckCircle}
          accentColor="emerald"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          subtitle="Todo + In Progress"
          icon={Icons.Clock}
          accentColor="amber"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Currently active"
          icon={Icons.Kanban}
          accentColor="blue"
        />
        <StatCard
          title="High Priority"
          value={stats.highPriority}
          subtitle="Requires attention"
          icon={Icons.Flame}
          accentColor="rose"
        />
      </div>

      {/* Task Completion & Priority Progress Section */}
      <ProgressOverview stats={stats} tasks={tasks} />

      {/* Recent Tasks Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent Tasks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest tasks created in your account
            </p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all tasks
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No tasks created yet"
              description="Get started by creating your first task. All statistics and progress metrics will update automatically."
              actionLabel="Create First Task"
              onAction={() => openCreateModal('Todo')}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {recentTasks.map((task) => {
              const isCompleted = task.status === 'Completed';
              return (
                <div
                  key={task._id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() =>
                        changeTaskStatus(
                          task._id,
                          isCompleted ? 'Todo' : 'Completed'
                        )
                      }
                      aria-label={`Mark "${task.title}" as ${
                        isCompleted ? 'incomplete' : 'completed'
                      }`}
                      className="w-4 h-4 mt-1 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => setSelectedTask(task)}
                        className={`text-sm font-semibold text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </button>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{task.category}</span>
                        {task.dueDate && (
                          <>
                            <span>•</span>
                            <span>
                              Due{' '}
                              {new Date(task.dueDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    <button
                      type="button"
                      onClick={() => openEditModal(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50 transition-colors"
                      title="Edit task"
                      aria-label={`Edit ${task.title}`}
                    >
                      <Icons.Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskToDelete(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Icons.Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onEdit={openEditModal}
        onDelete={setTaskToDelete}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        isSubmitting={isDeleting}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${taskToDelete?.title}"?`}
      />
    </div>
  );
};
