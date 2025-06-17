import {
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CalendarIcon from "../../../public/calendar.svg";
import type { RootState } from "../../store";

const drawerWidth = 240;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Appointments", icon: <EventNoteIcon />, path: "/appointments" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  ];

  // Add schedule menu item for doctors
  if (user?.role === "DOCTOR") {
    menuItems.push({
      text: "Working Hours",
      icon: <AccessTimeIcon />,
      path: "/schedule",
    });
  }

  const handleLogout = () => {
    // TODO: Implement logout
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Button
            onClick={() => navigate("/dashboard")}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textTransform: "none",
              p: 0,
              mr: 2,
            }}
            disableRipple
          >
            <img
              src={CalendarIcon}
              alt="Logo"
              style={{ width: 32, height: 32, marginRight: 12 }}
            />
            <Typography variant="h6" noWrap component="div">
              Appointment System
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
