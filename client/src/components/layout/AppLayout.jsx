import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TaskFormModal } from '../tasks/TaskFormModal';
import { AlertBanner } from '../common/AlertBanner';
import { useTasks } from '../../hooks/useTasks';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('Todo');

  const { notification, dismissNotification } = useTasks();

  const handleOpenCreateModal = (initialStatus = 'Todo') => {
    setEditingTask(null);
    setDefaultStatus(typeof initialStatus === 'string' ? initialStatus : 'Todo');
    setCreateModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreateModal={() => handleOpenCreateModal('Todo')}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCreateModal={() => handleOpenCreateModal('Todo')}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {notification && (
            <AlertBanner
              type={notification.type}
              message={notification.message}
              onClose={dismissNotification}
            />
          )}

          <Outlet
            context={{
              openCreateModal: handleOpenCreateModal,
              openEditModal: handleOpenEditModal,
            }}
          />
        </main>
      </div>

      <TaskFormModal
        isOpen={createModalOpen}
        onClose={handleCloseModal}
        taskToEdit={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
};
