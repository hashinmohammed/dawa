import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const PATIENT_KEYS = {
  all: ["patients"],
  lists: () => [...PATIENT_KEYS.all, "list"],
  list: (filters) => [...PATIENT_KEYS.lists(), filters],
  details: () => [...PATIENT_KEYS.all, "detail"],
  detail: (id) => [...PATIENT_KEYS.details(), id],
};

export function usePatients(filters = {}) {
  return useQuery({
    queryKey: PATIENT_KEYS.list(filters),
    queryFn: () => patientService.getPatients(filters),
    placeholderData: keepPreviousData,
  });
}
