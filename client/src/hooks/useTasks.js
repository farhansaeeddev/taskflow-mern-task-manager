import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

/**
 * Custom hook to access task state, statistics, filters, and CRUD operations
 */
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
