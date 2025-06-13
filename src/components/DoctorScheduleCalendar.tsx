import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { addDays, format, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { doctorScheduleService } from "../services/doctorScheduleService";
import type { ScheduleView, ShiftType } from "../types";

interface DoctorScheduleCalendarProps {
  doctorId: string;
  onScheduleUpdate?: () => void;
}

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

const DoctorScheduleCalendar: React.FC<DoctorScheduleCalendarProps> = ({
  doctorId,
  onScheduleUpdate,
}) => {
  const [schedules, setSchedules] = useState<ScheduleView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleView | null>(
    null
  );
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [shiftType, setShiftType] = useState<ShiftType>("FULL_DAY");
  const [appointmentDuration, setAppointmentDuration] = useState<number>(30);

  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await doctorScheduleService.getDoctorSchedule(doctorId);
      setSchedules(data);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = (day: string) => {
    setSelectedDay(day);
    setEditingSchedule(null);
    setIsWorkingDay(true);
    setShiftType("FULL_DAY");
    setAppointmentDuration(30);
    setDialogOpen(true);
  };

  const handleEditSchedule = (schedule: ScheduleView) => {
    setEditingSchedule(schedule);
    setSelectedDay(schedule.dayOfWeek);
    setIsWorkingDay(schedule.isWorkingDay);
    setShiftType(schedule.shiftType);
    setAppointmentDuration(schedule.appointmentDurationMinutes);
    setDialogOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;

    try {
      await doctorScheduleService.deleteSchedule(scheduleId);
      await fetchSchedules();
      onScheduleUpdate?.();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
      setError("Failed to delete schedule");
    }
  };

  const handleSaveSchedule = async () => {
    if (!selectedDay) return;

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
      onScheduleUpdate?.();
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save schedule:", err);
      setError("Failed to save schedule");
    }
  };

  const resetForm = () => {
    setEditingSchedule(null);
    setSelectedDay("");
    setIsWorkingDay(true);
    setShiftType("FULL_DAY");
    setAppointmentDuration(30);
  };

  const getScheduleForDay = (day: string) => {
    return schedules.find((s) => s.dayOfWeek === day);
  };

  const getShiftColor = (shiftType: ShiftType) => {
    switch (shiftType) {
      case "MORNING":
        return "success";
      case "AFTERNOON":
        return "warning";
      case "FULL_DAY":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Weekly Schedule
        </Typography>

        <Grid container spacing={2}>
          {DAYS_OF_WEEK.map((day) => {
            const schedule = getScheduleForDay(day);
            const dayName = format(
              addDays(startOfWeek(new Date()), DAYS_OF_WEEK.indexOf(day)),
              "EEEE",
              { locale: tr }
            );

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    border: schedule ? "2px solid" : "1px solid",
                    borderColor: schedule ? "primary.main" : "divider",
                    position: "relative",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {dayName}
                    </Typography>
                    <Box>
                      {schedule && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEditSchedule(schedule)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {!schedule && (
                        <IconButton
                          size="small"
                          onClick={() => handleAddSchedule(day)}
                          color="primary"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {schedule ? (
                    <Box>
                      <Chip
                        label={schedule.shiftType}
                        color={getShiftColor(schedule.shiftType)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {SHIFT_TIMES[schedule.shiftType].start} -{" "}
                        {SHIFT_TIMES[schedule.shiftType].end}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {schedule.appointmentDurationMinutes} min appointments
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No schedule set
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Schedule Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSchedule ? "Edit Schedule" : "Add Schedule"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={selectedDay}
                label="Day of Week"
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <MenuItem key={day} value={day}>
                    {format(
                      addDays(
                        startOfWeek(new Date()),
                        DAYS_OF_WEEK.indexOf(day)
                      ),
                      "EEEE",
                      { locale: tr }
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={isWorkingDay}
                  onChange={(e) => setIsWorkingDay(e.target.checked)}
                />
              }
              label="Working Day"
              sx={{ mb: 2 }}
            />

            {isWorkingDay && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Shift Type</InputLabel>
                  <Select
                    value={shiftType}
                    label="Shift Type"
                    onChange={(e) => setShiftType(e.target.value as ShiftType)}
                  >
                    {SHIFT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type} ({SHIFT_TIMES[type].start} -{" "}
                        {SHIFT_TIMES[type].end})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Appointment Duration</InputLabel>
                  <Select
                    value={appointmentDuration}
                    label="Appointment Duration"
                    onChange={(e) =>
                      setAppointmentDuration(e.target.value as number)
                    }
                  >
                    {APPOINTMENT_DURATIONS.map((duration) => (
                      <MenuItem key={duration} value={duration}>
                        {duration} minutes
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveSchedule} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorScheduleCalendar;
