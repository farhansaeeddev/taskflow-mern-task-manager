import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskKanbanBoard } from '../components/tasks/TaskKanbanBoard';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const KanbanPage = () => {
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    changeTaskStatus,
    deleteTask,
  } = useTasks();
  const { openCreateModal, openEditModal } = useOutletContext();

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
    return <LoadingSpinner message="Loading Kanban board..." />;
  }

  return (
    <div className="space-y-6">
      <TaskFilterBar showStatusFilter={false} />

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      <TaskKanbanBoard
        tasks={filteredTasks}
        onEdit={openEditModal}
        onDelete={setTaskToDelete}
        onSelectTask={setSelectedTask}
        onStatusChange={changeTaskStatus}
        onCreateInColumn={(status) => openCreateModal(status)}
      />

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
