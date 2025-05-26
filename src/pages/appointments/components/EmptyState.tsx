import { Add as AddIcon, EventBusy } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import type { EmptyStateProps } from "../types/appointment.types";

export const EmptyState = ({
  filter,
  userRole,
  onNavigate,
}: EmptyStateProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      textAlign: "center",
      bgcolor: "background.default",
      borderRadius: 2,
    }}
  >
    <EventBusy sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      No Appointments Found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {filter
        ? `There are no ${filter} appointments to display.`
        : "You don't have any appointments yet."}
    </Typography>
    {userRole === "PATIENT" && !filter && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => onNavigate("/appointments/create")}
        sx={{ mt: 2 }}
      >
        Schedule New Appointment
      </Button>
    )}
  </Paper>
);
