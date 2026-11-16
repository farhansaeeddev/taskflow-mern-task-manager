import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from '../api/taskService';
import { useAuth } from '../hooks/useAuth';

export const TaskContext = createContext(null);

const INITIAL_FILTERS = {
  search: '',
  status: 'All',
  priority: 'All',
  category: 'All',
  sort: 'newest',
};

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Display temporary toast/banner message for user actions
  const showNotification = useCallback((type, message) => {
    setNotification({ id: Date.now(), type, message });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Fetch all tasks belonging to the logged-in user
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasksApi();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Reload tasks whenever authentication state or active user changes
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchTasks();
    } else {
      setTasks([]);
      setFilters(INITIAL_FILTERS);
    }
  }, [isAuthenticated, user?._id, fetchTasks]);

  // Create a new task
  const createTask = useCallback(
    async (taskData) => {
      setError(null);
      try {
        const data = await createTaskApi(taskData);
        setTasks((prev) => [data.task, ...prev]);
        showNotification('success', 'Task created successfully.');
        return { success: true, task: data.task };
      } catch (err) {
        const msg = err.message || 'Could not create task.';
        showNotification('error', msg);
        return { success: false, message: msg };
      }
    },
    [showNotification]
  );

  // Update an existing task
  const updateTask = useCallback(
    async (taskId, updates) => {
      setError(null);
      try {
        const data = await updateTaskApi(taskId, updates);
        setTasks((prev) =>
          prev.map((item) => (item._id === taskId ? data.task : item))
        );
        showNotification('success', 'Task updated successfully.');
        return { success: true, task: data.task };
      } catch (err) {
        const msg = err.message || 'Could not update task.';
        showNotification('error', msg);
        return { success: false, message: msg };
      }
    },
    [showNotification]
  );

  // Quick status change (mark completed or move across Kanban columns)
  const changeTaskStatus = useCallback(
    async (taskId, newStatus) => {
      return updateTask(taskId, { status: newStatus });
    },
    [updateTask]
  );

  // Delete a task
  const deleteTask = useCallback(
    async (taskId) => {
      setError(null);
      try {
        await deleteTaskApi(taskId);
        setTasks((prev) => prev.filter((item) => item._id !== taskId));
        showNotification('success', 'Task deleted.');
        return { success: true };
      } catch (err) {
        const msg = err.message || 'Could not delete task.';
        showNotification('error', msg);
        return { success: false, message: msg };
      }
    },
    [showNotification]
  );

  // Update filter or sort criteria
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Dynamically derive unique categories from user's tasks + standard defaults
  const categories = useMemo(() => {
    const defaultCategories = ['General', 'Development', 'Design', 'Marketing', 'Bug Fix', 'Research'];
    const customCategories = tasks
      .map((t) => t.category)
      .filter((c) => Boolean(c) && !defaultCategories.includes(c));
    return [...defaultCategories, ...new Set(customCategories)];
  }, [tasks]);

  // Apply search, status, priority, category filters and sorting
  const filteredTasks = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        !searchLower ||
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));

      const matchesStatus =
        filters.status === 'All' || task.status === filters.status;

      const matchesPriority =
        filters.priority === 'All' || task.priority === filters.priority;

      const matchesCategory =
        filters.category === 'All' || task.category === filters.category;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (filters.sort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (filters.sort === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return new Date(b.createdAt) - new Date(a.createdAt);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      // Default: newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, filters]);

  // Compute real-time dashboard statistics from the user's database records
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const todo = tasks.filter((t) => t.status === 'Todo').length;
    const pending = todo + inProgress;
    const highPriority = tasks.filter((t) => t.priority === 'High').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      pending,
      highPriority,
      completionRate,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        stats,
        categories,
        filters,
        loading,
        error,
        notification,
        fetchTasks,
        createTask,
        updateTask,
        changeTaskStatus,
        deleteTask,
        updateFilter,
        resetFilters,
        dismissNotification,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
