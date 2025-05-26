import { AxiosError } from 'axios';
import { getFormattedErrorMessage, getHttpErrorMessage } from '../common/constants/errorMessages';
import type { LoginCredentials, RegisterData, User } from '../types/auth';
import api from './api';

export class AuthServiceError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AuthServiceError(
              getFormattedErrorMessage('AUTH', 'INVALID_CREDENTIALS'),
              status,
              'AUTH_INVALID_CREDENTIALS'
            );
          case 400:
            throw new AuthServiceError(
              getFormattedErrorMessage('VALIDATION', 'INVALID_INPUT'),
              status,
              'AUTH_INVALID_INPUT'
            );
          default:
            throw new AuthServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'AUTH_LOGIN_FAILED'
            );
        }
      }
      throw new AuthServiceError(getFormattedErrorMessage('AUTH', 'INVALID_CREDENTIALS'));
    }
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<{ user: User; token: string }>('/auth/register', data);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 409:
            throw new AuthServiceError(
              getFormattedErrorMessage('AUTH', 'ACCOUNT_EXISTS'),
              status,
              'AUTH_ACCOUNT_EXISTS'
            );
          case 400:
            throw new AuthServiceError(
              getFormattedErrorMessage('VALIDATION', 'INVALID_INPUT'),
              status,
              'AUTH_INVALID_INPUT'
            );
          default:
            throw new AuthServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'AUTH_REGISTER_FAILED'
            );
        }
      }
      throw new AuthServiceError(getFormattedErrorMessage('AUTH', 'INVALID_CREDENTIALS'));
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AuthServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          default:
            throw new AuthServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'AUTH_FETCH_USER_FAILED'
            );
        }
      }
      throw new AuthServiceError(getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'));
    }
  },

  logout(): void {
    localStorage.removeItem('token');
  }
}; 