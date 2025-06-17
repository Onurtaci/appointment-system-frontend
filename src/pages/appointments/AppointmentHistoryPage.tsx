import { FilterAlt, FilterList, History } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { tr } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { fetchPatientAppointments } from "../../store/slices/appointmentSlice";
import type { AppointmentPatientView } from "../../types/index";

interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  status: "all" | "APPROVED" | "REJECTED";
  searchTerm: string;
}

interface LocationState {
  refresh?: boolean;
}

const AppointmentHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments, loading } = useSelector(
    (state: RootState) => state.appointments
  );

  // State management
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentPatientView | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    status: "all",
    searchTerm: "",
  });

  // Utility functions
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "APPROVED":
        return "success" as const;
      case "REJECTED":
        return "error" as const;
      default:
        return "default" as const;
    }
  }, []);

  const formatDateTime = useCallback((dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        return { date: "Invalid Date", time: "Invalid Time" };
      }
      return {
        date: date.toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
    } catch {
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  }, []);

  // Fetch appointments on mount
  useEffect(() => {
    // Only fetch if appointments are empty or explicitly requested
    if (
      appointments.length === 0 ||
      (location.state as LocationState)?.refresh
    ) {
      if (user?.role === "PATIENT") {
        dispatch(fetchPatientAppointments());
      }
      // Clear the refresh flag
      if ((location.state as LocationState)?.refresh) {
        navigate(location.pathname, {
          state: { ...(location.state as LocationState), refresh: false },
          replace: true,
        });
      }
    }
  }, [
    dispatch,
    user?.role,
    appointments.length,
    location.state,
    navigate,
    location,
  ]);

  // Memoized filtered appointments
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    let filtered = appointments.filter(
      (app: AppointmentPatientView) => new Date(app.appointmentTime) < now
    );

    // Apply filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (app: AppointmentPatientView) =>
          new Date(app.appointmentTime) >= filters.startDate!
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (app: AppointmentPatientView) =>
          new Date(app.appointmentTime) <= filters.endDate!
      );
    }
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (app: AppointmentPatientView) => app.status === filters.status
      );
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((app: AppointmentPatientView) => {
        const doctorName = app.doctor
          ? `${app.doctor.firstName} ${app.doctor.lastName}`.toLowerCase()
          : "";
        return doctorName.includes(searchLower);
      });
    }

    // Sort by date (most recent first)
    return [...filtered].sort(
      (a, b) =>
        new Date(b.appointmentTime).getTime() -
        new Date(a.appointmentTime).getTime()
    );
  }, [appointments, filters]);

  // Event handlers
  const handleAppointmentClick = useCallback(
    (appointment: AppointmentPatientView) => {
      setSelectedAppointment(appointment);
      setIsDialogOpen(true);
    },
    []
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  }, []);

  const handleFilterChange = <K extends keyof FilterState>(
    field: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      status: "all",
      searchTerm: "",
    });
  };

  // Dialog component
  const AppointmentDetailsDialog = useCallback(() => {
    if (!selectedAppointment) return null;
    const { date, time } = formatDateTime(selectedAppointment.appointmentTime);
    const doctorName = selectedAppointment.doctor
      ? `${selectedAppointment.doctor.firstName} ${selectedAppointment.doctor.lastName}`
      : "Unknown User";
    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Past Appointment Details</Typography>
            <Chip
              label={selectedAppointment.status}
              color={getStatusColor(selectedAppointment.status)}
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Doctor
              </Typography>
              <Typography variant="body1" gutterBottom>
                {doctorName}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Appointment Time
              </Typography>
              <Typography variant="body1" gutterBottom>
                {date} at {time}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Status
              </Typography>
              <Chip
                label={selectedAppointment.status}
                color={getStatusColor(selectedAppointment.status)}
                size="small"
              />
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Doctor&apos;s Notes
              </Typography>
              {selectedAppointment.note ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {selectedAppointment.note}
                  </Typography>
                </Paper>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No notes were added for this appointment.
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }, [
    selectedAppointment,
    isDialogOpen,
    handleCloseDialog,
    formatDateTime,
    getStatusColor,
  ]);

  // Loading state component
  const renderLoadingState = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Card key={i} sx={{ opacity: 0.7 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={32}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  // Empty state component
  const renderEmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: "center",
        bgcolor: "background.default",
        borderRadius: 2,
      }}
    >
      <History sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Past Appointments
      </Typography>
      <Typography variant="body2" color="text.secondary">
        You don&apos;t have any past appointments to display.
      </Typography>
    </Paper>
  );

  // Filter panel component
  const FilterPanel = () => (
    <Collapse in={showFilters}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          bgcolor: "background.default",
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={tr}
            >
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange("startDate", date)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={tr}
            >
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange("endDate", date)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  handleFilterChange(
                    "status",
                    e.target.value as FilterState["status"]
                  )
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Search Doctor"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Tooltip title="Clear Filters">
                <IconButton size="small" onClick={clearFilters} color="primary">
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Collapse>
  );

  return (
    <Box>
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "background.default",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <History color="primary" />
            <Typography variant="h5">Appointment History</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt />}
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? "primary" : "inherit"}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/appointments")}
            >
              Back to Appointments
            </Button>
          </Stack>
        </Box>

        <FilterPanel />

        <Divider sx={{ my: 2 }} />

        {loading ? (
          renderLoadingState()
        ) : filteredAppointments.length === 0 ? (
          renderEmptyState()
        ) : (
          <Grid container spacing={2}>
            {filteredAppointments.map((appointment) => (
              <Grid item xs={12} key={appointment.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                      bgcolor: "action.hover",
                    },
                  }}
                  onClick={() =>
                    handleAppointmentClick(
                      appointment as AppointmentPatientView
                    )
                  }
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={1}>
                          <Typography variant="h6" component="div">
                            {appointment.doctor
                              ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                              : "Unknown User"}
                          </Typography>
                          <Typography color="text.secondary">
                            {(() => {
                              const { date, time } = formatDateTime(
                                appointment.appointmentTime
                              );
                              return `${date} at ${time}`;
                            })()}
                          </Typography>
                          {appointment.note && (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1,
                                bgcolor: "background.paper",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                <Typography
                                  component="span"
                                  variant="subtitle2"
                                  color="primary"
                                  sx={{ mr: 1 }}
                                >
                                  Note:
                                </Typography>
                                {appointment.note}
                              </Typography>
                            </Box>
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
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {isDialogOpen && selectedAppointment && <AppointmentDetailsDialog />}
    </Box>
  );
};

export default AppointmentHistoryPage;
