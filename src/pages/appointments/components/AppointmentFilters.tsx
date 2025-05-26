import { Close } from "@mui/icons-material";
import {
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { tr } from "date-fns/locale";
import type { AppointmentFiltersProps } from "../types/appointment.types";

export const AppointmentFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  userRole,
}: AppointmentFiltersProps) => (
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
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => onFilterChange("startDate", date)}
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
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => onFilterChange("endDate", date)}
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
                onFilterChange(
                  "status",
                  e.target.value as typeof filters.status
                )
              }
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label={`Search ${userRole === "DOCTOR" ? "Patient" : "Doctor"}`}
            value={filters.searchTerm}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="Clear Filters">
              <IconButton size="small" onClick={onClearFilters} color="primary">
                <Close />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  </Collapse>
);
