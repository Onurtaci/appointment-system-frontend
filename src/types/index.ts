export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "DOCTOR" | "PATIENT";
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDoctorView extends Omit<Appointment, "doctorId"> {
  patientId: string;
  note?: string;
}

export interface AppointmentPatientView extends Omit<Appointment, "patientId"> {
  doctorId: string;
  note?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  appointments: AppointmentState;
}

export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type ShiftType = "MORNING" | "AFTERNOON" | "FULL_DAY";

export interface ScheduleView {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isWorkingDay: boolean;
}

export interface ScheduleCreate {
  doctorId: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}

export type ScheduleUpdate = ScheduleCreate;

export interface LoadingStates {
  appointments: boolean;
  userDetails: boolean;
  approve: Record<string, boolean>;
  reject: Record<string, boolean>;
  noteSave: Record<string, boolean>;
}

export interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  status: "all" | "PENDING" | "APPROVED" | "REJECTED";
  searchTerm: string;
}