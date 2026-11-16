import { useState } from 'react';
import { PriorityBadge } from '../common/Badge';
import { Icons } from '../common/Icons';

const COLUMNS = [
  {
    id: 'Todo',
    title: 'Todo',
    dotColor: 'bg-slate-400',
    headerBorder: 'border-t-slate-400',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    dotColor: 'bg-blue-500',
    headerBorder: 'border-t-blue-500',
  },
  {
    id: 'Completed',
    title: 'Completed',
    dotColor: 'bg-emerald-500',
    headerBorder: 'border-t-emerald-500',
  },
];

export const TaskKanbanBoard = ({
  tasks,
  onEdit,
  onDelete,
  onSelectTask,
  onStatusChange,
  onCreateInColumn,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);
    setDragOverColumn(null);

    if (!taskId) return;
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== targetStatus) {
      await onStatusChange(taskId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const isDropTarget = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 border-t-4 ${
              column.headerBorder
            } rounded-xl p-4 flex flex-col min-h-[480px] transition-colors ${
              isDropTarget
                ? 'ring-2 ring-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                : ''
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onCreateInColumn(column.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800 transition-colors"
                title={`Add task to ${column.title}`}
                aria-label={`Add task to ${column.title}`}
              >
                <Icons.Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Cards Stack */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="h-40 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg flex flex-col items-center justify-center text-center p-4">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    No tasks in {column.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => onCreateInColumn(column.id)}
                    className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add a task
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-grab active:cursor-grabbing"
                  >
                    {/* Top Row: Category & Priority */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 truncate max-w-[140px]">
                        {task.category}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>

                    {/* Title */}
                    <button
                      type="button"
                      onClick={() => onSelectTask(task)}
                      className={`text-left text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block w-full ${
                        task.status === 'Completed'
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </button>

                    {/* Description Preview */}
                    {task.description && (
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Card Footer: Due Date + Status Selector + Edit/Delete */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Icons.Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatDate(task.dueDate) || 'No due date'}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <select
                          aria-label={`Move ${task.title} to status`}
                          value={task.status}
                          onChange={(e) =>
                            onStatusChange(task._id, e.target.value)
                          }
                          className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => onEdit(task)}
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50 transition-colors"
                          title="Edit task"
                          aria-label={`Edit ${task.title}`}
                        >
                          <Icons.Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(task)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete task"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Icons.Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
