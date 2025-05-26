import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthInitializer from "./components/auth/AuthInitializer";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";
import AppointmentHistoryPage from "./pages/appointments/AppointmentHistoryPage";
import AppointmentListPage from "./pages/appointments/AppointmentListPage";
import CreateAppointmentPage from "./pages/appointments/CreateAppointmentPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DoctorSchedulePage from "./pages/doctor/DoctorSchedulePage";
import ProfilePage from "./pages/profile/ProfilePage";
import { store } from "./store";
import theme from "./theme";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box
            sx={{
              minHeight: "100vh",
              width: "100vw",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            <CssBaseline />
            <BrowserRouter
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <AuthInitializer>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <MainLayout>
                          <Navigate to="/dashboard" replace />
                        </MainLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <MainLayout>
                          <DashboardPage />
                        </MainLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/appointments"
                    element={
                      <PrivateRoute>
                        <MainLayout>
                          <AppointmentListPage />
                        </MainLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <MainLayout>
                          <ProfilePage />
                        </MainLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/appointments/create"
                    element={
                      <PrivateRoute>
                        <MainLayout>
                          <CreateAppointmentPage />
                        </MainLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/appointments/history"
                    element={
                      <PrivateRoute allowedRoles={["PATIENT"]}>
                        <AppointmentHistoryPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/schedule"
                    element={
                      <PrivateRoute allowedRoles={["DOCTOR"]}>
                        <MainLayout>
                          <DoctorSchedulePage />
                        </MainLayout>
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </AuthInitializer>
            </BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
