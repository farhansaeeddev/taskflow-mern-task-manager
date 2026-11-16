const mongoose = require('mongoose');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Todo', 'In Progress', 'Completed'];

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

/**
 * Validate MongoDB ObjectId format
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Validate registration input fields
 */
const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return errors;
};

/**
 * Validate login input fields
 */
const validateLoginInput = ({ email, password }) => {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push('Password is required.');
  }

  return errors;
};

/**
 * Validate task creation or update payload
 */
const validateTaskInput = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Task title is required.');
    } else if (data.title.trim().length > 120) {
      errors.push('Task title cannot exceed 120 characters.');
    }
  }

  if (data.description !== undefined && typeof data.description === 'string' && data.description.length > 1500) {
    errors.push('Task description cannot exceed 1500 characters.');
  }

  if (data.category !== undefined && (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0)) {
    errors.push('Task category cannot be empty.');
  }

  if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (data.dueDate !== undefined && data.dueDate !== null && data.dueDate !== '') {
    const parsedDate = new Date(data.dueDate);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push('Due date must be a valid date.');
    }
  }

  return errors;
};

module.exports = {
  VALID_PRIORITIES,
  VALID_STATUSES,
  isValidEmail,
  isValidObjectId,
  validateRegisterInput,
  validateLoginInput,
  validateTaskInput,
};
