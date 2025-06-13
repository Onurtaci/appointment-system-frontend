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
  patient: User;
  doctor: User;
  appointmentTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDoctorView {
  id: string;
  patient: User;
  appointmentTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentPatientView {
  id: string;
  doctor: User;
  appointmentTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  note?: string;
  createdAt: string;
  updatedAt: string;
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
  doctor: User;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isWorkingDay: boolean;
  appointmentDurationMinutes: number;
  shiftType: ShiftType;
}

export interface ScheduleCreate {
  dayOfWeek: DayOfWeek;
  isWorkingDay: boolean;
  appointmentDurationMinutes: number;
  shiftType: ShiftType;
}

export type ScheduleUpdate = ScheduleCreate;

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}

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

// DTO Types for API requests
export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentTime: string;
}

export interface UpdateAppointmentStatusRequest {
  status: "APPROVED" | "REJECTED";
}

export interface AddAppointmentNoteRequest {
  note: string;
}

export interface RescheduleAppointmentRequest {
  appointmentTime: string;
}