import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import {
  fetchAppointments,
  updateAppointment,
} from "../../../store/slices/appointmentSlice";
import type { LoadingStates } from "../types/appointment.types";

export const useAppointmentActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    appointments: false,
    userDetails: false,
    approve: {},
    reject: {},
    noteSave: {},
  });

  const handleApprove = useCallback(
    async (appointmentId: string) => {
      setLoadingStates((prev) => ({
        ...prev,
        approve: { ...prev.approve, [appointmentId]: true },
      }));
      try {
        await dispatch(
          updateAppointment({ id: appointmentId, data: { status: "APPROVED" } })
        ).unwrap();
        await dispatch(fetchAppointments());
      } catch (error) {
        console.error("Failed to approve appointment:", error);
        throw error;
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          approve: { ...prev.approve, [appointmentId]: false },
        }));
      }
    },
    [dispatch]
  );

  const handleReject = useCallback(
    async (appointmentId: string) => {
      setLoadingStates((prev) => ({
        ...prev,
        reject: { ...prev.reject, [appointmentId]: true },
      }));
      try {
        await dispatch(
          updateAppointment({ id: appointmentId, data: { status: "REJECTED" } })
        ).unwrap();
        await dispatch(fetchAppointments());
      } catch (error) {
        console.error("Failed to reject appointment:", error);
        throw error;
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          reject: { ...prev.reject, [appointmentId]: false },
        }));
      }
    },
    [dispatch]
  );

  const handleSaveNoteAction = useCallback(
    async (appointmentId: string, note: string) => {
      setLoadingStates((prev) => ({
        ...prev,
        noteSave: { ...prev.noteSave, [appointmentId]: true },
      }));
      try {
        await dispatch(
          updateAppointment({
            id: appointmentId,
            data: { notes: note },
          })
        ).unwrap();
        await dispatch(fetchAppointments());
      } catch (error) {
        console.error("Failed to save note:", error);
        throw error;
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          noteSave: { ...prev.noteSave, [appointmentId]: false },
        }));
      }
    },
    [dispatch]
  );

  const setAppointmentsLoading = useCallback((loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, appointments: loading }));
  }, []);

  const setUserDetailsLoading = useCallback((loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, userDetails: loading }));
  }, []);

  return {
    loadingStates,
    handleApprove,
    handleReject,
    handleSaveNoteAction,
    setAppointmentsLoading,
    setUserDetailsLoading,
  };
}; 