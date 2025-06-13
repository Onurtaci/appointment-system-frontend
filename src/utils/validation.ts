import * as yup from 'yup';

// Validation constants that match backend constraints
export const VALIDATION_CONSTRAINTS = {
  FIRST_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  LAST_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^\d+$/,
  },
  APPOINTMENT_DURATION: {
    MIN_MINUTES: 15,
    MAX_MINUTES: 120,
  },
} as const;

// Common validation schemas
export const nameSchema = yup
  .string()
  .min(VALIDATION_CONSTRAINTS.FIRST_NAME.MIN_LENGTH, `Name must be at least ${VALIDATION_CONSTRAINTS.FIRST_NAME.MIN_LENGTH} characters`)
  .max(VALIDATION_CONSTRAINTS.FIRST_NAME.MAX_LENGTH, `Name must not exceed ${VALIDATION_CONSTRAINTS.FIRST_NAME.MAX_LENGTH} characters`)
  .required('Name is required');

export const emailSchema = yup
  .string()
  .email('Invalid email format')
  .max(VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH, `Email must be less than ${VALIDATION_CONSTRAINTS.EMAIL.MAX_LENGTH} characters`)
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .min(VALIDATION_CONSTRAINTS.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION_CONSTRAINTS.PASSWORD.MIN_LENGTH} characters`)
  .matches(VALIDATION_CONSTRAINTS.PASSWORD.PATTERN, 'Password must contain only numbers')
  .required('Password is required');

export const roleSchema = yup
  .string()
  .oneOf(['PATIENT', 'DOCTOR'], 'Role must be either PATIENT or DOCTOR')
  .required('Role is required');

export const appointmentDurationSchema = yup
  .number()
  .min(VALIDATION_CONSTRAINTS.APPOINTMENT_DURATION.MIN_MINUTES, `Duration must be at least ${VALIDATION_CONSTRAINTS.APPOINTMENT_DURATION.MIN_MINUTES} minutes`)
  .max(VALIDATION_CONSTRAINTS.APPOINTMENT_DURATION.MAX_MINUTES, `Duration must not exceed ${VALIDATION_CONSTRAINTS.APPOINTMENT_DURATION.MAX_MINUTES} minutes`)
  .required('Duration is required');

// Composite schemas
export const registerSchema = yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: roleSchema,
});

export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export const updateUserSchema = yup.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
});

export const createScheduleSchema = yup.object({
  dayOfWeek: yup.string().oneOf(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).required('Day of week is required'),
  isWorkingDay: yup.boolean().required('Working day status is required'),
  appointmentDurationMinutes: appointmentDurationSchema,
  shiftType: yup.string().oneOf(['MORNING', 'AFTERNOON', 'FULL_DAY']).required('Shift type is required'),
});

// Utility functions
export const validateField = async (schema: yup.Schema, value: any): Promise<string | null> => {
  try {
    await schema.validate(value);
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Validation failed';
  }
};

export const validateForm = async (schema: yup.ObjectSchema<any>, values: any): Promise<Record<string, string> | null> => {
  try {
    await schema.validate(values, { abortEarly: false });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return errors;
    }
    return { general: 'Validation failed' };
  }
}; 