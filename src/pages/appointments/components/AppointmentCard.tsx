import { EventBusy, EventNote } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { AppointmentCardProps } from "../types/appointment.types";

export const AppointmentCard = ({
  appointment,
  userName,
  onAppointmentClick,
  onApprove,
  onReject,
  isDoctor,
  loadingStates,
  formatDateTime,
  getStatusColor,
}: AppointmentCardProps) => {
  const { date, time } = formatDateTime(appointment.appointmentTime);
  const isLoading =
    loadingStates.approve[appointment.id] ||
    loadingStates.reject[appointment.id] ||
    loadingStates.noteSave[appointment.id];

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[4],
          bgcolor: "action.hover",
        },
      }}
      onClick={() => onAppointmentClick(appointment)}
    >
      {isLoading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      )}
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Stack spacing={1}>
              <Typography variant="h6" component="div">
                {userName}
              </Typography>
              <Typography color="text.secondary">
                {date} at {time}
              </Typography>
              {appointment.note && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {appointment.note}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              alignItems="center"
            >
              <Chip
                label={appointment.status}
                color={getStatusColor(appointment.status)}
                size="small"
              />
              {isDoctor && appointment.status === "PENDING" && (
                <>
                  <Tooltip title="Approve Appointment">
                    <IconButton
                      size="small"
                      color="success"
                      disabled={
                        loadingStates.approve[appointment.id] ||
                        loadingStates.reject[appointment.id]
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(appointment.id);
                      }}
                    >
                      {loadingStates.approve[appointment.id] ? (
                        <CircularProgress size={20} color="success" />
                      ) : (
                        <EventNote />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject Appointment">
                    <IconButton
                      size="small"
                      color="error"
                      disabled={
                        loadingStates.approve[appointment.id] ||
                        loadingStates.reject[appointment.id]
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(appointment.id);
                      }}
                    >
                      {loadingStates.reject[appointment.id] ? (
                        <CircularProgress size={20} color="error" />
                      ) : (
                        <EventBusy />
                      )}
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
