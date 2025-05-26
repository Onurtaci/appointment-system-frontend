import type { AppointmentDoctorView, AppointmentPatientView } from "../../../types";

export interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  status: "all" | "PENDING" | "APPROVED" | "REJECTED";
  searchTerm: string;
}

export interface LoadingStates {
  appointments: boolean;
  userDetails: boolean;
  approve: Record<string, boolean>;
  reject: Record<string, boolean>;
  noteSave: Record<string, boolean>;
}

export interface NoteEditorProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  isSaving: boolean;
  error: string | null;
}

export interface AppointmentCardProps {
  appointment: AppointmentDoctorView | AppointmentPatientView;
  userName: string;
  onAppointmentClick: (appointment: AppointmentDoctorView | AppointmentPatientView) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isDoctor: boolean;
  loadingStates: {
    approve: Record<string, boolean>;
    reject: Record<string, boolean>;
    noteSave: Record<string, boolean>;
  };
  formatDateTime: (dateTimeStr: string) => { date: string; time: string };
  getStatusColor: (status: string) => "success" | "error" | "warning" | "default";
}

export interface AppointmentDetailsDialogProps {
  appointment: AppointmentDoctorView | AppointmentPatientView;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSaveNote: (value: string) => void;
  isDoctor: boolean;
  loadingStates: {
    approve: Record<string, boolean>;
    reject: Record<string, boolean>;
    noteSave: Record<string, boolean>;
  };
  formatDateTime: (dateTimeStr: string) => { date: string; time: string };
  getStatusColor: (status: string) => "success" | "error" | "warning" | "default";
}

export interface AppointmentFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(field: K, value: FilterState[K]) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  userRole: "DOCTOR" | "PATIENT";
}

export interface AppointmentListHeaderProps {
  filter: "all" | "pending" | "upcoming" | undefined;
  showFilters: boolean;
  onToggleFilters: () => void;
  onNavigate: (path: string, options?: { replace?: boolean; state?: any }) => void;
  userRole: "DOCTOR" | "PATIENT";
}

export interface EmptyStateProps {
  filter: "all" | "pending" | "upcoming" | undefined;
  userRole: "DOCTOR" | "PATIENT";
  onNavigate: (path: string) => void;
} 