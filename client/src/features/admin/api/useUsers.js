import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: adminService.getUsers,
  });
};
