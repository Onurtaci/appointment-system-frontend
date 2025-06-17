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

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !doctorId) {
        setTimeSlots([]);
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
        // Backend'den available slotları çek
        const slots = await appointmentService.getAvailableTimeSlots(
          doctorId,
          dateStr
        );
        setTimeSlots(slots.map((slot) => ({ time: slot, available: true })));
      } catch (err) {
        console.error("Failed to fetch available slots:", err);
        setError("Failed to load available time slots");
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableSlots();
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
