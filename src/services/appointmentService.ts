import { AxiosError } from 'axios';
import { getFormattedErrorMessage, getHttpErrorMessage } from '../common/constants/errorMessages';
import type { Appointment, AppointmentDoctorView } from '../types';
import api from './api';

interface RescheduleAppointmentData {
  appointmentId: string;
  appointmentTime: string;
}

export class AppointmentServiceError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'AppointmentServiceError';
  }
}

export const appointmentService = {
  async createAppointment(data: {
    doctorId: string;
    patientId: string;
    appointmentTime: string;
  }): Promise<Appointment> {
    try {
      const response = await api.post<Appointment>('/appointments', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          throw new Error('This time slot is already booked');
        }
        throw new Error(error.response?.data?.message || 'Failed to create appointment');
      }
      throw error;
    }
  },

  async getDoctorAppointments(doctorId: string): Promise<AppointmentDoctorView[]> {
    try {
      const response = await api.get<AppointmentDoctorView[]>(`/appointments/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_FETCH_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'FETCH_FAILED'));
    }
  },

  async getMyAppointments(): Promise<Appointment[]> {
    try {
      const response = await api.get('/appointments/me');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('ROLES', 'PATIENT_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_FETCH_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'FETCH_FAILED'));
    }
  },

  async getMyDoctorAppointments(): Promise<Appointment[]> {
    try {
      const response = await api.get('/appointments/doctor/me');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_FETCH_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'FETCH_FAILED'));
    }
  },

  async updateAppointmentStatus({ appointmentId, status }: { appointmentId: string; status: 'APPROVED' | 'REJECTED' }): Promise<void> {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          case 404:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('APPOINTMENT', 'NOT_FOUND'),
              status,
              'APPT_NOT_FOUND'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_UPDATE_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'UPDATE_FAILED'));
    }
  },

  async addAppointmentNote(appointmentId: string, note: string): Promise<void> {
    try {
      await api.post(`/appointments/${appointmentId}/notes`, { note });
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          case 404:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('APPOINTMENT', 'NOT_FOUND'),
              status,
              'APPT_NOT_FOUND'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_UPDATE_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'UPDATE_FAILED'));
    }
  },

  async deleteAppointment(appointmentId: string): Promise<void> {
    try {
      await api.delete(`/appointments/${appointmentId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          case 404:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('APPOINTMENT', 'NOT_FOUND'),
              status,
              'APPT_NOT_FOUND'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_DELETE_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'DELETE_FAILED'));
    }
  },

  async rescheduleAppointment(data: RescheduleAppointmentData): Promise<void> {
    try {
      await api.put(`/appointments/${data.appointmentId}/reschedule`, data);
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 401:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('AUTH', 'SESSION_EXPIRED'),
              status,
              'AUTH_SESSION_EXPIRED'
            );
          case 403:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('ROLES', 'DOCTOR_ONLY'),
              status,
              'AUTH_UNAUTHORIZED'
            );
          case 404:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('APPOINTMENT', 'NOT_FOUND'),
              status,
              'APPT_NOT_FOUND'
            );
          case 409:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('APPOINTMENT', 'ALREADY_BOOKED'),
              status,
              'APPT_TIME_SLOT_BOOKED'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_RESCHEDULE_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'UPDATE_FAILED'));
    }
  },

  async getBookedTimeSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      const response = await api.get(`/appointments/booked-slots`, {
        params: { doctorId, date }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 400:
            throw new AppointmentServiceError(
              errorData?.message || 'Invalid parameters',
              status,
              'INVALID_INPUT'
            );
          case 404:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('DOCTOR', 'NOT_FOUND'),
              status,
              'DOCTOR_NOT_FOUND'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_FETCH_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'FETCH_FAILED'));
    }
  },

  async getAvailableTimeSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      const response = await api.get(`/appointments/available-slots`, {
        params: { doctorId, date }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        switch (status) {
          case 400:
            throw new AppointmentServiceError(
              errorData?.message || 'Invalid parameters',
              status,
              'INVALID_INPUT'
            );
          case 404:
            throw new AppointmentServiceError(
              getFormattedErrorMessage('DOCTOR', 'NOT_FOUND'),
              status,
              'DOCTOR_NOT_FOUND'
            );
          default:
            throw new AppointmentServiceError(
              getHttpErrorMessage(status || 500, errorData?.message),
              status,
              'APPT_FETCH_FAILED'
            );
        }
      }
      throw new AppointmentServiceError(getFormattedErrorMessage('APPOINTMENT', 'FETCH_FAILED'));
    }
  }
}; 