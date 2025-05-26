import axios, { AxiosError } from 'axios';
import { ErrorMessages, getHttpErrorMessage } from '../common/constants/errorMessages';
import type { ScheduleView } from '../types';
import type { User } from '../types/auth';
import api from './api';

export class UserServiceError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export const userService = {
  async getDoctors(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/users/doctors');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new UserServiceError(
          getHttpErrorMessage(error.response?.status || 500, error.response?.data?.message),
          error.response?.status,
          error.code
        );
      }
      throw new UserServiceError(ErrorMessages.USER.FETCH_FAILED);
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) {
          throw new UserServiceError(
            "User not found",
            status,
            "USER_NOT_FOUND"
          );
        }
        throw new UserServiceError(
          getHttpErrorMessage(status || 500, error.response?.data?.message),
          status,
          "SERVER_ERROR"
        );
      }
      throw new UserServiceError(ErrorMessages.USER.FETCH_FAILED);
    }
  },

  async updateUser(userId: string, data: { firstName?: string; lastName?: string; email?: string }): Promise<User> {
    try {
      const response = await api.patch<User>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new UserServiceError(
              ErrorMessages.AUTH.SESSION_EXPIRED,
              status,
              'UNAUTHORIZED'
            );
          case 403:
            throw new UserServiceError(
              ErrorMessages.AUTH.UNAUTHORIZED,
              status,
              'FORBIDDEN'
            );
          case 404:
            throw new UserServiceError(
              ErrorMessages.USER.NOT_FOUND,
              status,
              'USER_NOT_FOUND'
            );
          case 409:
            throw new UserServiceError(
              'Email is already in use',
              status,
              'EMAIL_IN_USE'
            );
          case 400:
            throw new UserServiceError(
              errorData?.message || 'Invalid input data',
              status,
              'INVALID_INPUT'
            );
          default:
            throw new UserServiceError(
              ErrorMessages.NETWORK.SERVER_ERROR,
              status,
              'SERVER_ERROR'
            );
        }
      }
      throw new UserServiceError(ErrorMessages.USER.UPDATE_FAILED);
    }
  },

  async getDoctorSchedule(doctorId: string): Promise<ScheduleView[]> {
    try {
      const response = await api.get<ScheduleView[]>(`/doctor-schedules/${doctorId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new UserServiceError("Doctor not found");
        }
        if (error.response?.status === 403) {
          throw new UserServiceError("You are not authorized for this operation");
        }
        throw new UserServiceError(error.response?.data?.message || "Failed to get doctor's schedule");
      }
      throw new UserServiceError("An unexpected error occurred");
    }
  },
}; 