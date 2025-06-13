import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { appointmentService } from "../services/appointmentService";

interface TimeSlotSelectorProps {
  doctorId: string;
  selectedDate: Date | null;
  onTimeSlotSelect: (timeSlot: string) => void;
  selectedTimeSlot: string;
  disabled?: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  doctorId,
  selectedDate,
  onTimeSlotSelect,
  selectedTimeSlot,
  disabled = false,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate time slots from 09:00 to 17:30 with 30-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    const interval = 30;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        // Skip lunch break (12:00-13:00)
        if (hour === 12 && minute >= 0) continue;

        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push({
          time: timeString,
          available: true,
        });
      }
    }
    return slots;
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || !doctorId) {
        setTimeSlots(generateTimeSlots());
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Convert selected date to local date string (YYYY-MM-DD)
        const localDate = new Date(
          selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        );
        const dateStr = localDate.toISOString().split("T")[0];

        const bookedSlots = await appointmentService.getBookedTimeSlots(
          doctorId,
          dateStr
        );

        const allSlots = generateTimeSlots();
        const updatedSlots = allSlots.map((slot) => ({
          ...slot,
          available: !bookedSlots.includes(slot.time),
        }));

        setTimeSlots(updatedSlots);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
        setError("Failed to load available time slots");
        setTimeSlots(generateTimeSlots());
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, doctorId]);

  const handleTimeSlotClick = (timeSlot: string) => {
    if (disabled) return;

    const slot = timeSlots.find((s) => s.time === timeSlot);
    if (slot && slot.available) {
      onTimeSlotSelect(timeSlot);
    }
  };

  const getSlotColor = (slot: TimeSlot) => {
    if (!slot.available) return "error";
    if (selectedTimeSlot === slot.time) return "primary";
    return "inherit";
  };

  const getSlotVariant = (slot: TimeSlot) => {
    if (!slot.available) return "outlined";
    if (selectedTimeSlot === slot.time) return "contained";
    return "outlined";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Available Time Slots
      </Typography>

      {selectedDate && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {format(selectedDate, "EEEE, MMMM d, yyyy", { locale: tr })}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={1}>
        {timeSlots.map((slot) => (
          <Grid item xs={6} sm={4} md={3} key={slot.time}>
            <Button
              variant={getSlotVariant(slot)}
              color={getSlotColor(slot)}
              fullWidth
              disabled={!slot.available || disabled}
              onClick={() => handleTimeSlotClick(slot.time)}
              sx={{
                minHeight: 48,
                fontSize: "0.875rem",
                textTransform: "none",
              }}
            >
              {slot.time}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label="Available"
          color="success"
          variant="outlined"
          size="small"
        />
        <Chip label="Booked" color="error" variant="outlined" size="small" />
        <Chip label="Selected" color="primary" variant="filled" size="small" />
      </Box>
    </Paper>
  );
};

export default TimeSlotSelector;
