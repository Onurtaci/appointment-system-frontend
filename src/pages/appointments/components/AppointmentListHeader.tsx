import {
  Add as AddIcon,
  EventNote,
  FilterAlt,
  FilterList,
  History,
} from "@mui/icons-material";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import type { AppointmentListHeaderProps } from "../types/appointment.types";

export const AppointmentListHeader = ({
  filter,
  showFilters,
  onToggleFilters,
  onNavigate,
  userRole,
}: AppointmentListHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      <EventNote color="primary" />
      <Typography variant="h5">
        {filter ? (
          <>{filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments</>
        ) : (
          "Appointments"
        )}
      </Typography>
      {filter && (
        <Chip
          icon={<FilterList />}
          label={`Filtered: ${filter}`}
          color="primary"
          variant="outlined"
          size="small"
        />
      )}
    </Stack>
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        startIcon={<FilterAlt />}
        onClick={onToggleFilters}
        color={showFilters ? "primary" : "inherit"}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>
      {userRole === "PATIENT" && !filter && (
        <>
          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => onNavigate("/appointments/history")}
          >
            View History
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onNavigate("/appointments/create")}
          >
            New Appointment
          </Button>
        </>
      )}
      {filter && (
        <Button
          variant="outlined"
          onClick={() => onNavigate("/appointments", { replace: true })}
        >
          Clear Filter
        </Button>
      )}
    </Stack>
  </Box>
);
