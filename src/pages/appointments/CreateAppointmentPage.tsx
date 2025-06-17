import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AxiosError } from "axios";
import { tr } from "date-fns/locale";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { appointmentService } from "../../services/appointmentService";
import { doctorScheduleService } from "../../services/doctorScheduleService";
import { userService } from "../../services/userService";
import type { AppDispatch, RootState } from "../../store";
import { createAppointment } from "../../store/slices/appointmentSlice";
import type { ScheduleView } from "../../types";
import type { User } from "../../types/auth";

const validationSchema = yup.object().shape({
  doctorId: yup.string().required("Doctor selection is required"),
  timeSlot: yup.string().required("Appointment time selection is required"),
});

const CreateAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.appointments);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [doctors, setDoctors] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [doctorSchedule, setDoctorSchedule] = useState<ScheduleView | null>(
    null
  );

  const formik = useFormik({
    initialValues: {
      doctorId: "",
      date: null as Date | null,
      timeSlot: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!values.date || !values.timeSlot || !user) return;

      try {
        // Combine date and time slot
        const [hours, minutes] = values.timeSlot.split(":");
        const appointmentDateTime = new Date(values.date);
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Convert to local time string (YYYY-MM-DDTHH:mm:ss)
        const localDateTime = appointmentDateTime.toLocaleString("sv", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        const [datePart, timePart] = localDateTime.split(" ");
        const localDateTimeStr = `${datePart}T${timePart}`;

        await dispatch(
          createAppointment({
            doctorId: values.doctorId,
            patientId: user.id,
            appointmentTime: localDateTimeStr,
          })
        ).unwrap();

        navigate("/appointments", {
          state: { refresh: true, scrollToTop: true },
        });
      } catch (err) {
        console.error("Failed to create appointment:", err);
        if (err instanceof AxiosError) {
          setError(
            err.response?.data?.message || "Failed to create appointment"
          );
        } else {
          setError("An unexpected error occurred");
        }
      }
    },
  });

  // Fetch doctors on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to access this page");
      navigate("/login");
      return;
    }

    if (user?.role !== "PATIENT") {
      setError("Only patients can create appointments");
      navigate("/dashboard");
      return;
    }

    const fetchDoctors = async () => {
      try {
        const doctorsList = await userService.getDoctors();
        setDoctors(doctorsList);
      } catch {
        setError("Failed to fetch doctors");
      }
    };

    fetchDoctors();
  }, [isAuthenticated, user?.role, navigate]);

  // Fetch doctor schedule when doctor is selected
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!formik.values.doctorId || !selectedDate) return;

      try {
        const schedules = await doctorScheduleService.getDoctorSchedule(
          formik.values.doctorId
        );

        // Convert selected date to local date
        const localDate = new Date(selectedDate);
        localDate.setHours(0, 0, 0, 0);
        const dayOfWeek = localDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const schedule = schedules.find((s: ScheduleView) => {
          // Convert JavaScript's getDay() (0=Sunday, 1=Monday) to backend's DayOfWeek string enum
          // JavaScript: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
          // Backend: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
          const dayNames = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
          ];
          const selectedDayName = dayNames[dayOfWeek];
          return s.dayOfWeek === selectedDayName;
        });

        setDoctorSchedule(schedule || null);
      } catch (error) {
        console.error("Failed to fetch doctor schedule:", error);
        setDoctorSchedule(null);
      }
    };

    fetchDoctorSchedule();
  }, [formik.values.doctorId, selectedDate]);

  // Get available time slots based on doctor's schedule and booked slots
  const getAvailableTimeSlots = useCallback(async () => {
    if (!selectedDate || !formik.values.doctorId) return;
    setLoadingTimeSlots(true);
    try {
      // Convert selected date to local date string (YYYY-MM-DD)
      const localDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const dateStr = localDate.toISOString().split("T")[0];
      // Backend'den dinamik slotları çek
      const slots = await appointmentService.getAvailableTimeSlots(
        formik.values.doctorId,
        dateStr
      );
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error("Failed to fetch available time slots:", error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  }, [selectedDate, formik.values.doctorId]);

  // Update available time slots when date or doctor schedule changes
  useEffect(() => {
    getAvailableTimeSlots();
  }, [getAvailableTimeSlots]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Create New Appointment
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="doctor-label">Select Doctor</InputLabel>
                    <Select
                      labelId="doctor-label"
                      id="doctorId"
                      name="doctorId"
                      value={formik.values.doctorId}
                      label="Select Doctor"
                      onChange={(e: SelectChangeEvent) => {
                        formik.handleChange(e);
                        setSelectedDate(null); // Reset date when doctor changes
                        formik.setFieldValue("timeSlot", ""); // Reset time slot
                      }}
                      error={
                        formik.touched.doctorId &&
                        Boolean(formik.errors.doctorId)
                      }
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {formik.values.doctorId && (
                  <Grid item xs={12}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={tr}
                    >
                      <DatePicker
                        label="Appointment Date"
                        value={selectedDate}
                        onChange={(newValue) => {
                          setSelectedDate(newValue);
                          formik.setFieldValue("date", newValue);
                          formik.setFieldValue("timeSlot", "");
                        }}
                        minDate={new Date()}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error:
                              formik.touched.date &&
                              Boolean(formik.errors.date),
                            helperText:
                              formik.touched.date &&
                              (formik.errors.date as string),
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                )}

                {selectedDate && !doctorSchedule && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Doctor is not working today.
                  </Alert>
                )}

                {selectedDate && doctorSchedule && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Available Time Slots (
                      {doctorSchedule.startTime.toString().substring(0, 5)} -{" "}
                      {doctorSchedule.endTime.toString().substring(0, 5)})
                    </Typography>
                    {loadingTimeSlots ? (
                      <Box
                        sx={{ display: "flex", justifyContent: "center", p: 3 }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Grid container spacing={1}>
                        {availableTimeSlots.map((slot) => {
                          const isAvailable = true;
                          const isSelected = formik.values.timeSlot === slot;
                          return (
                            <Grid item xs={6} sm={4} md={3} key={slot}>
                              <Paper
                                elevation={isSelected ? 3 : 1}
                                sx={{
                                  p: 2,
                                  textAlign: "center",
                                  cursor: isAvailable
                                    ? "pointer"
                                    : "not-allowed",
                                  bgcolor: isSelected
                                    ? "primary.main"
                                    : "background.paper",
                                  color: isSelected
                                    ? "primary.contrastText"
                                    : "text.primary",
                                  opacity: isAvailable ? 1 : 0.5,
                                  "&:hover": isAvailable
                                    ? {
                                        bgcolor: isSelected
                                          ? "primary.dark"
                                          : "action.hover",
                                      }
                                    : {},
                                  border: isSelected
                                    ? "2px solid"
                                    : "1px solid",
                                  borderColor: isSelected
                                    ? "primary.main"
                                    : "divider",
                                }}
                                onClick={() => {
                                  if (isAvailable) {
                                    formik.setFieldValue("timeSlot", slot);
                                  }
                                }}
                              >
                                <Typography variant="body1">{slot}</Typography>
                              </Paper>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                    {formik.touched.timeSlot && formik.errors.timeSlot && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {formik.errors.timeSlot as string}
                      </Typography>
                    )}
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || !formik.isValid || !formik.dirty}
                  >
                    {loading ? "Creating Appointment..." : "Create Appointment"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CreateAppointmentPage;
