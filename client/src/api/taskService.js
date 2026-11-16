import { apiRequest } from './apiClient';

/**
 * Fetch all tasks for the authenticated user
 */
export const fetchTasksApi = async (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

  return apiRequest(endpoint, {
    method: 'GET',
  });
};

/**
 * Fetch a single task by ID
 */
export const fetchTaskByIdApi = async (taskId) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'GET',
  });
};

/**
 * Create a new task
 */
export const createTaskApi = async (taskData) => {
  return apiRequest('/tasks', {
    method: 'POST',
    body: taskData,
  });
};

/**
 * Update an existing task by ID
 */
export const updateTaskApi = async (taskId, updates) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: updates,
  });
};

/**
 * Delete a task by ID
 */
export const deleteTaskApi = async (taskId) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
};
