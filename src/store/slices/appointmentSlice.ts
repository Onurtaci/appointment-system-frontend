import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { appointmentService } from '../../services/appointmentService';
import type { Appointment, AppointmentState, RootState } from '../../types';

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (_, { getState }) => {
    const { user } = (getState() as RootState).auth;
    if (!user) throw new Error('User not authenticated');
    
    if (user.role === 'DOCTOR') {
      return appointmentService.getMyDoctorAppointments();
    } else {
      return appointmentService.getMyAppointments();
    }
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  "appointments/fetchDoctorAppointments",
  async (appointments?: Appointment[]) => {
    if (appointments) {
      return appointments;
    }
    const response = await appointmentService.getMyDoctorAppointments();
    return response;
  }
);

export const fetchPatientAppointments = createAsyncThunk(
  "appointments/fetchPatientAppointments",
  async (appointments?: Appointment[]) => {
    if (appointments) {
      return appointments;
    }
    const response = await appointmentService.getMyAppointments();
    return response;
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (data: { doctorId: string; patientId: string; appointmentTime: string }, { rejectWithValue }) => {
    try {
      await appointmentService.createAppointment({
        doctorId: data.doctorId,
        patientId: data.patientId,
        appointmentTime: data.appointmentTime
      });
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, data }: { id: string; data: { status?: 'APPROVED' | 'REJECTED'; notes?: string } }, { getState }) => {
    const { user } = (getState() as RootState).auth;
    if (!user || user.role !== 'DOCTOR') {
      throw new Error('Unauthorized: Only doctors can update appointments');
    }
    if (data.status) {
      await appointmentService.updateAppointmentStatus({ appointmentId: id, status: data.status });
    }
    if (data.notes) {
      await appointmentService.addAppointmentNote(id, data.notes);
    }
    return { id, ...data };
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      // Fetch Doctor Appointments
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctor appointments';
      })
      // Fetch Patient Appointments
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patient appointments';
      })
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.appointments.push(action.payload);
        }
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create appointment';
      })
      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...action.payload };
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update appointment';
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer; 