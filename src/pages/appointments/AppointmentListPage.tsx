import {
  Alert,
  Box,
  Divider,
  Grid,
  LinearProgress,
  Paper,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchDoctorAppointments,
  fetchPatientAppointments,
} from "../../store/slices/appointmentSlice";
import type {
  AppointmentDoctorView,
  AppointmentPatientView,
} from "../../types/index";
import { AppointmentCard } from "./components/AppointmentCard";
import { AppointmentFilters } from "./components/AppointmentFilters";
import { AppointmentListHeader } from "./components/AppointmentListHeader";
import { AppointmentListSkeleton } from "./components/AppointmentListSkeleton";
import { EmptyState } from "./components/EmptyState";
import { NoteEditorDialog } from "./components/NoteEditorDialog";
import { useAppointmentActions } from "./hooks/useAppointmentActions";
import { useAppointmentFilters } from "./hooks/useAppointmentFilters";
import { useUserDetails } from "./hooks/useUserDetails";

const AppointmentListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector(
    (state: RootState) => state.appointments
  );

  const {
    loadingStates,
    handleApprove,
    handleReject,
    handleSaveNoteAction,
    setAppointmentsLoading,
    setUserDetailsLoading,
  } = useAppointmentActions();

  const {
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  } = useAppointmentFilters();

  const [selectedAppointment, setSelectedAppointment] = useState<
    AppointmentDoctorView | AppointmentPatientView | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  // Get filter from navigation state
  const filter = location.state?.filter as
    | "all"
    | "pending"
    | "upcoming"
    | undefined;

  // Memoize unique user IDs
  const uniqueUserIds = useMemo(() => {
    const userIds = appointments
      .map((appointment: AppointmentDoctorView | AppointmentPatientView) => {
        if (user?.role === "DOCTOR") {
          return (appointment as AppointmentDoctorView).patient?.id;
        } else {
          return (appointment as AppointmentPatientView).doctor?.id;
        }
      })
      .filter((id: string | undefined): id is string => !!id);

    return Array.from(new Set(userIds)) as string[];
  }, [appointments, user?.role]);

  const {
    userDetails: userDetailsMap,
    userDetailsError,
    setUserDetailsError,
  } = useUserDetails(uniqueUserIds, setUserDetailsLoading);

  // Memoize filtered appointments
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    let filtered = [...appointments];

    // Apply filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (app) => new Date(app.appointmentTime) >= filters.startDate!
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (app) => new Date(app.appointmentTime) <= filters.endDate!
      );
    }
    if (filters.status !== "all") {
      filtered = filtered.filter((app) => app.status === filters.status);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((app) => {
        const userId =
          user?.role === "DOCTOR"
            ? (app as AppointmentDoctorView).patient?.id
            : (app as AppointmentPatientView).doctor?.id;
        if (!userId) return false;
        return userDetailsMap[userId]?.toLowerCase().includes(searchLower);
      });
    }

    // Only show current and future appointments for patients
    if (filter === "pending") {
      filtered = filtered.filter((app) => app.status === "PENDING");
    } else if (filter === "upcoming") {
      filtered = filtered.filter(
        (app) =>
          new Date(app.appointmentTime) >= now && app.status === "APPROVED"
      );
    } else if (!filter && user?.role === "PATIENT") {
      filtered = filtered.filter(
        (app) =>
          new Date(app.appointmentTime) >= now && app.status !== "REJECTED"
      );
    }

    // Sort by date
    return [...filtered].sort(
      (a, b) =>
        new Date(a.appointmentTime).getTime() -
        new Date(b.appointmentTime).getTime()
    );
  }, [appointments, filter, user?.role, filters, userDetailsMap]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointmentsData = async () => {
      if (appointments.length === 0 || location.state?.refresh) {
        setAppointmentsLoading(true);
        try {
          if (user?.role === "DOCTOR") {
            await dispatch(fetchDoctorAppointments());
          } else {
            await dispatch(fetchPatientAppointments());
          }
          if (location.state?.refresh) {
            navigate(location.pathname, {
              state: { ...location.state, refresh: false },
              replace: true,
            });
          }
        } finally {
          setAppointmentsLoading(false);
        }
      }
    };
    fetchAppointmentsData();
  }, [
    dispatch,
    user?.role,
    appointments.length,
    location.state?.refresh,
    navigate,
    location,
    setAppointmentsLoading,
  ]);

  // Scroll to top when filter changes
  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo(0, 0);
      navigate(location.pathname, {
        state: { ...location.state, scrollToTop: false },
        replace: true,
      });
    }
  }, [location.state?.scrollToTop, navigate, location]);

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

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "APPROVED":
        return "success" as const;
      case "REJECTED":
        return "error" as const;
      case "PENDING":
        return "warning" as const;
      default:
        return "default" as const;
    }
  }, []);

  const handleAppointmentClick = useCallback(
    (appointment: AppointmentDoctorView | AppointmentPatientView) => {
      setSelectedAppointment(appointment);
      setNoteText(appointment.note || "");
      setIsDialogOpen(true);
    },
    []
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
    setNoteText("");
    setIsEditingNote(false);
  }, []);

  const handleSaveNote = useCallback(
    async (value: string) => {
      if (!selectedAppointment) return;

      setIsDialogOpen(false);
      setSelectedAppointment(null);
      setNoteText("");
      setIsEditingNote(false);

      try {
        await handleSaveNoteAction(selectedAppointment.id, value);
      } catch (error) {
        setNoteError("Failed to save medical note. Please try again.");
        console.error("Error saving note:", error);
      }
    },
    [selectedAppointment, handleSaveNoteAction]
  );

  const handleStartEditingNote = useCallback(() => {
    if (!selectedAppointment) return;
    setNoteText(selectedAppointment.note || "");
    setIsEditingNote(true);
    setNoteError(null);
  }, [selectedAppointment]);

  const handleCancelEditingNote = useCallback(() => {
    setIsEditingNote(false);
    setNoteText("");
    setNoteError(null);
  }, []);

  // Dialog için userName'i seçili randevuya göre oluştur
  let dialogUserName = "Unknown User";
  if (selectedAppointment) {
    if (
      user?.role === "DOCTOR" &&
      (selectedAppointment as AppointmentDoctorView).patient
    ) {
      const patient = (selectedAppointment as AppointmentDoctorView).patient;
      dialogUserName = `${patient.firstName} ${patient.lastName}`;
    } else if (
      user?.role === "PATIENT" &&
      (selectedAppointment as AppointmentPatientView).doctor
    ) {
      const doctor = (selectedAppointment as AppointmentPatientView).doctor;
      dialogUserName = `${doctor.firstName} ${doctor.lastName}`;
    }
  }

  return (
    <Box>
      {(loadingStates.appointments || loadingStates.userDetails) && (
        <LinearProgress
          sx={{
            mb: 3,
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        />
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "background.default",
          borderRadius: 2,
          position: "relative",
          minHeight: loadingStates.appointments ? "400px" : "auto",
        }}
      >
        <AppointmentListHeader
          filter={filter}
          showFilters={showFilters}
          onToggleFilters={toggleFilters}
          onNavigate={navigate}
          userRole={user?.role as "DOCTOR" | "PATIENT"}
        />

        {userDetailsError && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            onClose={() => setUserDetailsError(null)}
          >
            {userDetailsError}
          </Alert>
        )}

        <AppointmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          userRole={user?.role as "DOCTOR" | "PATIENT"}
        />

        <Divider sx={{ my: 2 }} />

        {loadingStates.appointments ? (
          <AppointmentListSkeleton />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            filter={filter}
            userRole={user?.role as "DOCTOR" | "PATIENT"}
            onNavigate={navigate}
          />
        ) : (
          <Grid container spacing={2}>
            {filteredAppointments.map((appointment) => {
              let userName = "Unknown User";
              if (
                user?.role === "DOCTOR" &&
                (appointment as AppointmentDoctorView).patient
              ) {
                const patient = (appointment as AppointmentDoctorView).patient;
                userName = `${patient.firstName} ${patient.lastName}`;
              } else if (
                user?.role === "PATIENT" &&
                (appointment as AppointmentPatientView).doctor
              ) {
                const doctor = (appointment as AppointmentPatientView).doctor;
                userName = `${doctor.firstName} ${doctor.lastName}`;
              }
              return (
                <Grid item xs={12} key={appointment.id}>
                  <AppointmentCard
                    appointment={appointment}
                    userName={userName}
                    onAppointmentClick={handleAppointmentClick}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isDoctor={user?.role === "DOCTOR"}
                    loadingStates={loadingStates}
                    formatDateTime={formatDateTime}
                    getStatusColor={getStatusColor}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      {isDialogOpen && selectedAppointment && (
        <NoteEditorDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          appointment={selectedAppointment}
          initialValue={noteText}
          onSave={handleSaveNote}
          onCancel={handleCancelEditingNote}
          isSaving={loadingStates.noteSave[selectedAppointment.id]}
          error={noteError}
          isEditing={isEditingNote}
          onStartEditing={handleStartEditingNote}
          userName={dialogUserName}
          userRole={user?.role as "DOCTOR" | "PATIENT"}
          formatDateTime={formatDateTime}
          getStatusColor={getStatusColor}
        />
      )}
    </Box>
  );
};

export default AppointmentListPage;
