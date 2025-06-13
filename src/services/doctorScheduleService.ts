import { AxiosError } from 'axios';
import { getFormattedErrorMessage, getHttpErrorMessage } from '../common/constants/errorMessages';
import type { ScheduleCreate, ScheduleUpdate, ScheduleView } from "../types";
import api from "./api";

export class DoctorScheduleServiceError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'DoctorScheduleServiceError';
  }
}

export const doctorScheduleService = {
  async getMySchedule(): Promise<ScheduleView[]> {
    try {
      const response = await api.get<ScheduleView[]>("/doctor-schedules/me");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_FETCH_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'FETCH_FAILED'));
    }
  },

  async getDoctorSchedule(doctorId: string): Promise<ScheduleView[]> {
    try {
      const response = await api.get<ScheduleView[]>(`/doctor-schedules/${doctorId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 404:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('DOCTOR', 'NOT_FOUND'),
              status,
              'DOCTOR_NOT_FOUND'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_FETCH_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'FETCH_FAILED'));
    }
  },

  async createSchedule(doctorId: string, schedule: ScheduleCreate): Promise<{ id: string }> {
    try {
      const response = await api.post<{ id: string }>(`/doctor-schedules/${doctorId}`, schedule);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          case 400:
            throw new DoctorScheduleServiceError(
              errorData?.message || 'Invalid schedule data',
              status,
              'INVALID_INPUT'
            );
          case 409:
            throw new DoctorScheduleServiceError(
              'Schedule already exists for this day',
              status,
              'SCHEDULE_ALREADY_EXISTS'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_CREATE_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'CREATE_FAILED'));
    }
  },

  async updateSchedule(doctorId: string, scheduleId: string, schedule: ScheduleUpdate): Promise<void> {
    try {
      await api.put(`/doctor-schedules/${doctorId}/${scheduleId}`, schedule);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          case 404:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('SCHEDULE', 'NOT_FOUND'),
              status,
              'SCHEDULE_NOT_FOUND'
            );
          case 400:
            throw new DoctorScheduleServiceError(
              errorData?.message || 'Invalid schedule data',
              status,
              'INVALID_INPUT'
            );
          case 409:
            throw new DoctorScheduleServiceError(
              'Schedule already exists for this day',
              status,
              'SCHEDULE_ALREADY_EXISTS'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_UPDATE_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'UPDATE_FAILED'));
    }
  },

  async deleteSchedule(doctorId: string, scheduleId: string): Promise<void> {
    try {
      await api.delete(`/doctor-schedules/${doctorId}/${scheduleId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          case 404:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('SCHEDULE', 'NOT_FOUND'),
              status,
              'SCHEDULE_NOT_FOUND'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_DELETE_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'DELETE_FAILED'));
    }
  },

  async getAvailableTimeSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      const response = await api.get<string[]>(`/doctor-schedules/${doctorId}/available-slots`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 400:
            throw new DoctorScheduleServiceError(
              errorData?.message || 'Invalid parameters',
              status,
              'INVALID_INPUT'
            );
          case 404:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('DOCTOR', 'NOT_FOUND'),
              status,
              'DOCTOR_NOT_FOUND'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_FETCH_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'FETCH_FAILED'));
    }
  },

  async checkAvailability(doctorId: string, date: string, time: string): Promise<{ isAvailable: boolean }> {
    try {
      const response = await api.get<{ isAvailable: boolean }>(`/doctor-schedules/${doctorId}/availability`, {
        params: { date, time }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 400:
            throw new DoctorScheduleServiceError(
              errorData?.message || 'Invalid parameters',
              status,
              'INVALID_INPUT'
            );
          case 404:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('DOCTOR', 'NOT_FOUND'),
              status,
              'DOCTOR_NOT_FOUND'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_FETCH_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'FETCH_FAILED'));
    }
  },

  async getWeeklySummary(doctorId: string): Promise<{ summary: string }> {
    try {
      const response = await api.get<{ summary: string }>(`/doctor-schedules/${doctorId}/weekly-summary`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 404:
            throw new DoctorScheduleServiceError(
              getFormattedErrorMessage('DOCTOR', 'NOT_FOUND'),
              status,
              'DOCTOR_NOT_FOUND'
            );
          default:
            throw new DoctorScheduleServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'SCHEDULE_FETCH_FAILED'
            );
        }
      }
      throw new DoctorScheduleServiceError(getFormattedErrorMessage('SCHEDULE', 'FETCH_FAILED'));
    }
  }
}; 