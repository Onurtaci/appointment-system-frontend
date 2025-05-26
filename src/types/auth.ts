import type { User } from './index';

export type { User };

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'DOCTOR';
}

export interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  loading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

export type LoginFormData = LoginCredentials;

export interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
  loading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthFormValidationSchema {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  role?: 'PATIENT' | 'DOCTOR';
} 