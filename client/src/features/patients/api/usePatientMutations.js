import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patientService";
import { PATIENT_KEYS } from "./usePatients";
import customToast from "../../../shared/ui/customToast";

export function useRegisterPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => patientService.registerPatient(data),
    onSuccess: () => {
      customToast.success("Patient registered successfully!");
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
    onError: (error) => {
      customToast.error(
        error.response?.data?.message || "Failed to register patient",
      );
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
    onSuccess: () => {
      customToast.success("Patient updated successfully");
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
    onError: (error) => {
      customToast.error(
        error.response?.data?.message || "Failed to update patient",
      );
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => patientService.deletePatient(id),
    onSuccess: () => {
      customToast.success("Patient deleted successfully");
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
    },
    onError: (error) => {
      customToast.error(
        error.response?.data?.message || "Failed to delete patient",
      );
    },
  });
}
