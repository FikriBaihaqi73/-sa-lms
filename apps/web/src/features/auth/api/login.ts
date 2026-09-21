import type { User, LoginCredentials } from '../types';
import { apiFetch } from '@/lib/api';

/**
 * Real API call for logging in via the NestJS Backend
 */
export const loginApi = async (credentials: LoginCredentials): Promise<User> => {
  // We assume the backend expects { email, password }
  // and returns { data: { user, token } } or similar based on ResponseHelper
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Extract the user from the standardized ResponseHelper structure `{ status, data, message }`
  return response.data.user;
};
