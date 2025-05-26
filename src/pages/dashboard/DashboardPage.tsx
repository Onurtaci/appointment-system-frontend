import { CalendarMonth, EventNote, Person } from "@mui/icons-material";
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchDoctorAppointments,
  fetchPatientAppointments,
} from "../../store/slices/appointmentSlice";

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector(
    (state: RootState) => state.appointments
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user?.role === "DOCTOR") {
          const appointments =
            await appointmentService.getMyDoctorAppointments();
          await dispatch(fetchDoctorAppointments(appointments));
        } else {
          const appointments = await appointmentService.getMyAppointments();
          await dispatch(fetchPatientAppointments(appointments));
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, [dispatch, user?.role]);

  // Memoize filtered appointments to prevent unnecessary recalculations
  const { pendingAppointments, upcomingAppointments } = useMemo(() => {
    const now = new Date();
    return {
      pendingAppointments: appointments.filter(
        (app) => app.status === "PENDING"
      ),
      upcomingAppointments: appointments.filter(
        (app) =>
          app.status === "APPROVED" && new Date(app.appointmentTime) > now
      ),
    };
  }, [appointments]);

  const handleStatClick = (filter: "all" | "pending" | "upcoming") => {
    navigate("/appointments", {
      state: {
        filter,
        scrollToTop: true,
      },
    });
  };

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      filter: "all" as const,
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments.length,
      icon: <EventNote sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      filter: "pending" as const,
    },
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: <Person sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      filter: "upcoming" as const,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName}!
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Paper
              onClick={() => handleStatClick(stat.filter)}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
              <Typography variant="h4" component="div" gutterBottom>
                {stat.value}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  "&:hover": {
                    color: stat.color,
                  },
                }}
              >
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
