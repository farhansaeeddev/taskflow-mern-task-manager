import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskListView } from '../components/tasks/TaskListView';
import { TaskKanbanBoard } from '../components/tasks/TaskKanbanBoard';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TasksPage = () => {
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    changeTaskStatus,
    deleteTask,
    resetFilters,
  } = useTasks();
  const { openCreateModal, openEditModal } = useOutletContext();

  const [viewMode, setViewMode] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    await deleteTask(taskToDelete._id);
    setIsDeleting(false);
    setTaskToDelete(null);
  };

  if (loading && tasks.length === 0) {
    return <LoadingSpinner message="Loading your tasks..." />;
  }

  return (
    <div className="space-y-6">
      <TaskFilterBar
        showStatusFilter={viewMode === 'list'}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <EmptyState
          title="Your task list is empty"
          description="Create your first task with priorities, categories, and due dates to start tracking your work."
          actionLabel="Create New Task"
          onAction={() => openCreateModal('Todo')}
        />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="No matching tasks found"
          description="No tasks matched your active search or filter criteria. Try adjusting or resetting your filters."
          actionLabel="Reset Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'list' ? (
        <TaskListView
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={setTaskToDelete}
          onSelectTask={setSelectedTask}
          onStatusChange={changeTaskStatus}
        />
      ) : (
        <TaskKanbanBoard
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={setTaskToDelete}
          onSelectTask={setSelectedTask}
          onStatusChange={changeTaskStatus}
          onCreateInColumn={(status) => openCreateModal(status)}
        />
      )}

      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onEdit={openEditModal}
        onDelete={setTaskToDelete}
      />

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
