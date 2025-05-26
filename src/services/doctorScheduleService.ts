import type { ScheduleCreate, ScheduleUpdate, ScheduleView } from "../types";
import api from "./api";

export const doctorScheduleService = {
  async getMySchedule(): Promise<ScheduleView[]> {
    const response = await api.get<ScheduleView[]>("/doctor-schedules/me");
    return response.data;
  },

  async getDoctorSchedule(doctorId: string): Promise<ScheduleView[]> {
    const response = await api.get<ScheduleView[]>(`/doctor-schedules/${doctorId}`);
    return response.data;
  },

  async createSchedule(schedule: ScheduleCreate): Promise<ScheduleView> {
    const response = await api.post<ScheduleView>("/doctor-schedules", schedule);
    return response.data;
  },

  async updateSchedule(id: string, schedule: ScheduleUpdate): Promise<ScheduleView> {
    const response = await api.put<ScheduleView>(`/doctor-schedules/${id}`, schedule);
    return response.data;
  },

  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/doctor-schedules/${id}`);
  },
}; 