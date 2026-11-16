import { apiRequest } from './apiClient';

/**
 * Register a new user account
 */
export const registerUserApi = async (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  });
};

/**
 * Log in an existing user
 */
export const loginUserApi = async (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  });
};

/**
 * Fetch current authenticated user's profile
 */
export const getCurrentUserApi = async () => {
  return apiRequest('/auth/me', {
    method: 'GET',
  });
};
