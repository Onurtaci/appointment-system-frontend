import { Close, Edit as EditIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import type {
  AppointmentDoctorView,
  AppointmentPatientView,
} from "../../../types/index";
import { NoteEditor } from "./NoteEditor";

interface NoteEditorDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentDoctorView | AppointmentPatientView;
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  isSaving: boolean;
  error: string | null;
  isEditing: boolean;
  onStartEditing: () => void;
  userName: string;
  formatDateTime: (dateTimeStr: string) => { date: string; time: string };
  getStatusColor: (
    status: string
  ) => "success" | "error" | "warning" | "default";
}

export const NoteEditorDialog = ({
  open,
  onClose,
  appointment,
  initialValue,
  onSave,
  onCancel,
  isSaving,
  error,
  isEditing,
  onStartEditing,
  userName,
  formatDateTime,
  getStatusColor,
}: NoteEditorDialogProps) => {
  const { date, time } = formatDateTime(appointment.appointmentTime);
  const isDoctor = appointment.status === "APPROVED";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Appointment Details</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {isSaving && <LinearProgress sx={{ mb: 2 }} />}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              {isDoctor ? "Patient" : "Doctor"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {userName}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Date & Time
            </Typography>
            <Typography variant="body1" gutterBottom>
              {date} at {time}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={appointment.status}
              color={getStatusColor(appointment.status)}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Medical Notes
                </Typography>
                {isDoctor && !isEditing && (
                  <IconButton
                    size="small"
                    onClick={onStartEditing}
                    disabled={isSaving}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>

              {isEditing ? (
                <NoteEditor
                  initialValue={initialValue}
                  onSave={onSave}
                  onCancel={onCancel}
                  isSaving={isSaving}
                  error={error}
                />
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    minHeight: "100px",
                    bgcolor: "background.default",
                  }}
                >
                  {appointment.note ? (
                    <Typography
                      variant="body2"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {appointment.note}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {isDoctor
                        ? "Click the edit button to add medical notes"
                        : "No medical notes available"}
                    </Typography>
                  )}
                </Paper>
              )}
            </Box>
          </Grid>

          {appointment.status === "REJECTED" && (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 1 }}>
                This appointment was rejected. Please contact the{" "}
                {isDoctor ? "patient" : "doctor"} for more information.
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
