import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doctorScheduleService } from "../../services/doctorScheduleService";
import type { AppDispatch, RootState } from "../../store";
import type { ScheduleView, ShiftType } from "../../types";

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const SHIFT_TYPES: ShiftType[] = ["MORNING", "AFTERNOON", "FULL_DAY"];

const SHIFT_TIMES = {
  MORNING: { start: "09:00", end: "12:00" },
  AFTERNOON: { start: "13:00", end: "18:00" },
  FULL_DAY: { start: "09:00", end: "18:00" },
} as const;

const APPOINTMENT_DURATIONS = [15, 30, 45, 60, 90, 120];

const DoctorSchedulePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [schedules, setSchedules] = useState<ScheduleView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleView | null>(
    null
  );

  // Form state
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [shiftType, setShiftType] = useState<ShiftType>("FULL_DAY");
  const [appointmentDuration, setAppointmentDuration] = useState<number>(30);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to access this page");
      navigate("/login");
      return;
    }

    if (user?.role !== "DOCTOR") {
      setError("Only doctors can access this page");
      navigate("/dashboard");
      return;
    }

    fetchSchedules();
  }, [isAuthenticated, user?.role, navigate]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await doctorScheduleService.getMySchedule();
      setSchedules(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to fetch schedules");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    setLoading(true);
    try {
      const scheduleData = {
        dayOfWeek: selectedDay as any,
        isWorkingDay,
        shiftType,
        appointmentDurationMinutes: appointmentDuration,
      };

      if (editingSchedule) {
        await doctorScheduleService.updateSchedule(
          editingSchedule.id,
          scheduleData
        );
      } else {
        await doctorScheduleService.createSchedule(scheduleData);
      }
      await fetchSchedules();
      resetForm();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to save schedule");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;

    setLoading(true);
    try {
      await doctorScheduleService.deleteSchedule(id);
      await fetchSchedules();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to delete schedule");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule: ScheduleView) => {
    setEditingSchedule(schedule);
    setSelectedDay(schedule.dayOfWeek);
    setIsWorkingDay(schedule.isWorkingDay);
    setShiftType(schedule.shiftType);
    setAppointmentDuration(schedule.appointmentDurationMinutes);
  };

  const resetForm = () => {
    setEditingSchedule(null);
    setSelectedDay("");
    setIsWorkingDay(true);
    setShiftType("FULL_DAY");
    setAppointmentDuration(30);
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Working Hours
      </Typography>

      <Grid container spacing={4}>
        {/* Form */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Day of Week</InputLabel>
                    <Select
                      value={selectedDay}
                      label="Day of Week"
                      onChange={(e) => setSelectedDay(e.target.value)}
                      disabled={loading}
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <MenuItem key={day} value={day}>
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Shift Type</InputLabel>
                    <Select
                      value={shiftType}
                      label="Shift Type"
                      onChange={(e) =>
                        setShiftType(e.target.value as ShiftType)
                      }
                      disabled={loading}
                      required
                    >
                      {SHIFT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0) +
                            type.slice(1).toLowerCase().replace("_", " ")}
                          {" ("}
                          {SHIFT_TIMES[type].start} - {SHIFT_TIMES[type].end}
                          {")"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Appointment Duration (minutes)</InputLabel>
                    <Select
                      value={appointmentDuration}
                      label="Appointment Duration (minutes)"
                      onChange={(e) =>
                        setAppointmentDuration(Number(e.target.value))
                      }
                      disabled={loading}
                    >
                      {APPOINTMENT_DURATIONS.map((duration) => (
                        <MenuItem key={duration} value={duration}>
                          {duration} minutes
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Working Day</InputLabel>
                    <Select
                      value={isWorkingDay}
                      label="Working Day"
                      onChange={(e) =>
                        setIsWorkingDay(e.target.value === "true")
                      }
                      disabled={loading}
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !selectedDay}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : editingSchedule ? (
                      "Update Schedule"
                    ) : (
                      "Add Schedule"
                    )}
                  </Button>

                  {editingSchedule && (
                    <Button
                      variant="outlined"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Schedule List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Schedule
              </Typography>

              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : schedules.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  No schedules found. Add your working hours above.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {schedules.map((schedule) => (
                    <Card key={schedule.id} variant="outlined">
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs>
                            <Typography variant="subtitle1">
                              {schedule.dayOfWeek.charAt(0) +
                                schedule.dayOfWeek.slice(1).toLowerCase()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {schedule.isWorkingDay
                                ? `${schedule.shiftType
                                    .toLowerCase()
                                    .replace("_", " ")}`
                                : "Not working"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Appointment Duration:{" "}
                              {schedule.appointmentDurationMinutes} minutes
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              onClick={() => handleEdit(schedule)}
                              disabled={loading}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(schedule.id)}
                              disabled={loading}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorSchedulePage;
