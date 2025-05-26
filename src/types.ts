export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ScheduleView {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isWorkingDay: boolean;
}

export interface ScheduleCreate {
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isWorkingDay: boolean;
}

export type ScheduleUpdate = ScheduleCreate; 