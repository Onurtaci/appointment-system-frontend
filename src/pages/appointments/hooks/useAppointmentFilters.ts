import { useCallback, useState } from "react";
import type { FilterState } from "../types/appointment.types";

export const useAppointmentFilters = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    status: "all",
    searchTerm: "",
  });

  const handleFilterChange = useCallback(<K extends keyof FilterState>(
    field: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      startDate: null,
      endDate: null,
      status: "all",
      searchTerm: "",
    });
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return {
    showFilters,
    filters,
    handleFilterChange,
    clearFilters,
    toggleFilters,
  };
}; 