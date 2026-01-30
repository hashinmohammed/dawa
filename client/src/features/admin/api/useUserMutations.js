import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import customToast from "../../../shared/ui/customToast";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const deleteUser = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      customToast.success("User removed successfully");
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userStats"]);
    },
    onError: (error) => {
      customToast.error(
        error.response?.data?.message || "Failed to delete user",
      );
    },
  });

  return { deleteUser };
};
