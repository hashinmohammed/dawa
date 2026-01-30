import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export const useAdminStats = (filters = {}) => {
  return useQuery({
    queryKey: ["adminStats", filters],
    queryFn: () => adminService.getStats(filters),
  });
};
