export type ErrorCategory = 'AUTH' | 'USER' | 'APPOINTMENT' | 'VALIDATION' | 'NETWORK' | 'ROLES' | 'SCHEDULE' | 'DOCTOR';

type ErrorCodeMap = {
  AUTH: 'SESSION_EXPIRED' | 'INVALID_CREDENTIALS' | 'UNAUTHORIZED' | 'ACCOUNT_EXISTS';
  USER: 'NOT_FOUND' | 'FETCH_FAILED' | 'UPDATE_FAILED' | 'DELETE_FAILED';
  APPOINTMENT: 'NOT_FOUND' | 'FETCH_FAILED' | 'CREATE_FAILED' | 'UPDATE_FAILED' | 'DELETE_FAILED' | 'ALREADY_BOOKED' | 'PAST_DATE';
  VALIDATION: 'INVALID_INPUT' | 'INVALID_DATE' | 'INVALID_TIME';
  NETWORK: 'SERVER_ERROR' | 'CONNECTION_FAILED' | 'UNKNOWN';
  ROLES: 'PATIENT_ONLY' | 'DOCTOR_ONLY' | 'ADMIN_ONLY';
  SCHEDULE: 'NOT_FOUND' | 'FETCH_FAILED' | 'CREATE_FAILED' | 'UPDATE_FAILED' | 'DELETE_FAILED';
  DOCTOR: 'NOT_FOUND' | 'FETCH_FAILED' | 'UPDATE_FAILED' | 'DELETE_FAILED';
};

type ErrorMessagesType = {
  [K in ErrorCategory]: {
    [C in ErrorCodeMap[K]]: string;
  };
};

export const ErrorMessages: ErrorMessagesType = {
  AUTH: {
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    ACCOUNT_EXISTS: 'An account with this email already exists.'
  },
  USER: {
    NOT_FOUND: 'User not found.',
    FETCH_FAILED: 'Failed to fetch user information.',
    UPDATE_FAILED: 'Failed to update user information.',
    DELETE_FAILED: 'Failed to delete user account.'
  },
  APPOINTMENT: {
    NOT_FOUND: 'Appointment not found.',
    FETCH_FAILED: 'Failed to fetch appointments.',
    CREATE_FAILED: 'Failed to create appointment.',
    UPDATE_FAILED: 'Failed to update appointment.',
    DELETE_FAILED: 'Failed to delete appointment.',
    ALREADY_BOOKED: 'This time slot is already booked.',
    PAST_DATE: 'Cannot create appointment for a past date.'
  },
  VALIDATION: {
    INVALID_INPUT: 'Please check your input and try again.',
    INVALID_DATE: 'Please select a valid date.',
    INVALID_TIME: 'Please select a valid time.'
  },
  NETWORK: {
    SERVER_ERROR: 'An error occurred on the server. Please try again later.',
    CONNECTION_FAILED: 'Failed to connect to the server. Please check your internet connection.',
    UNKNOWN: 'An unexpected error occurred. Please try again.'
  },
  ROLES: {
    PATIENT_ONLY: 'This action is only available for patients.',
    DOCTOR_ONLY: 'This action is only available for doctors.',
    ADMIN_ONLY: 'This action is only available for administrators.'
  },
  SCHEDULE: {
    NOT_FOUND: 'Schedule not found.',
    FETCH_FAILED: 'Failed to fetch schedule information.',
    CREATE_FAILED: 'Failed to create schedule.',
    UPDATE_FAILED: 'Failed to update schedule.',
    DELETE_FAILED: 'Failed to delete schedule.'
  },
  DOCTOR: {
    NOT_FOUND: 'Doctor not found.',
    FETCH_FAILED: 'Failed to fetch doctor information.',
    UPDATE_FAILED: 'Failed to update doctor information.',
    DELETE_FAILED: 'Failed to delete doctor account.'
  }
};

export function getFormattedErrorMessage<T extends ErrorCategory>(
  category: T,
  code: ErrorCodeMap[T]
): string {
  return ErrorMessages[category][code];
}

export function getHttpErrorMessage(status: number, message?: string): string {
  switch (status) {
    case 400:
      return ErrorMessages.VALIDATION.INVALID_INPUT;
    case 401:
      return ErrorMessages.AUTH.SESSION_EXPIRED;
    case 403:
      return ErrorMessages.AUTH.UNAUTHORIZED;
    case 404:
      return ErrorMessages.APPOINTMENT.NOT_FOUND;
    case 409:
      return ErrorMessages.APPOINTMENT.ALREADY_BOOKED;
    case 500:
      return ErrorMessages.NETWORK.SERVER_ERROR;
    default:
      return message || ErrorMessages.NETWORK.UNKNOWN;
  }
} 