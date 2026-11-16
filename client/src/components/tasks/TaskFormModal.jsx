import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useTasks } from '../../hooks/useTasks';

const DEFAULT_FORM = {
  title: '',
  description: '',
  category: 'General',
  priority: 'Medium',
  status: 'Todo',
  dueDate: '',
};

const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

export const TaskFormModal = ({
  isOpen,
  onClose,
  taskToEdit = null,
  defaultStatus = 'Todo',
}) => {
  const { createTask, updateTask, categories } = useTasks();

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      const existingCategory = taskToEdit.category || 'General';
      const inStandardList = categories.includes(existingCategory);
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        category: inStandardList ? existingCategory : '__custom__',
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Todo',
        dueDate: formatDateForInput(taskToEdit.dueDate),
      });
      setIsCustomCategory(!inStandardList);
      setCustomCategory(!inStandardList ? existingCategory : '');
    } else {
      setFormData({
        ...DEFAULT_FORM,
        status: defaultStatus || 'Todo',
      });
      setIsCustomCategory(false);
      setCustomCategory('');
    }
    setFormError('');
  }, [taskToEdit, defaultStatus, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      if (value === '__custom__') {
        setIsCustomCategory(true);
        setFormData((prev) => ({ ...prev, category: '__custom__' }));
      } else {
        setIsCustomCategory(false);
        setFormData((prev) => ({ ...prev, category: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setFormError('Task title is required.');
      return;
    }

    const finalCategory = isCustomCategory
      ? customCategory.trim()
      : formData.category.trim();

    if (!finalCategory) {
      setFormError('Please specify a task category.');
      return;
    }

    const payload = {
      title: trimmedTitle,
      description: formData.description.trim(),
      category: finalCategory,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate ? formData.dueDate : null,
    };

    setSubmitting(true);
    try {
      const result = taskToEdit
        ? await updateTask(taskToEdit._id, payload)
        : await createTask(payload);

      if (result.success) {
        onClose();
      } else {
        setFormError(result.message || 'Failed to save task.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 text-xs font-medium">
            {formError}
          </div>
        )}

        <div>
          <label
            htmlFor="task-title"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
          >
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-title"
            name="title"
            type="text"
            required
            maxLength={120}
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Implement JWT authentication middleware"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
          >
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            rows={3}
            maxLength={1500}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add context, acceptance criteria, or notes..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="task-category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Category
            </label>
            <select
              id="task-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">+ Custom Category...</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-dueDate"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Due Date
            </label>
            <input
              id="task-dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {isCustomCategory && (
          <div>
            <label
              htmlFor="task-custom-category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Custom Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-custom-category"
              type="text"
              maxLength={50}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g., DevOps, Client Deliverable"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="task-priority"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Priority
            </label>
            <select
              id="task-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-status"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Status
            </label>
            <select
              id="task-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-xs"
          >
            {submitting
              ? 'Saving...'
              : taskToEdit
              ? 'Save Changes'
              : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
