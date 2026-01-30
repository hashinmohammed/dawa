import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import customToast from "../../../shared/ui/customToast";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["adminSettings"],
    queryFn: adminService.getSettings,
  });

  const addSettingMutation = useMutation({
    mutationFn: adminService.addSettingValue,
    onSuccess: () => {
      customToast.success("Value added successfully");
      queryClient.invalidateQueries(["adminSettings"]);
    },
    onError: (error) => {
      customToast.error(error.response?.data?.message || "Failed to add value");
    },
  });

  const deleteSettingMutation = useMutation({
    mutationFn: adminService.deleteSettingValue,
    onSuccess: () => {
      customToast.success("Value removed successfully");
      queryClient.invalidateQueries(["adminSettings"]);
    },
    onError: (error) => {
      customToast.error(
        error.response?.data?.message || "Failed to remove value",
      );
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    addValue: addSettingMutation.mutate,
    isAdding: addSettingMutation.isPending,
    deleteValue: deleteSettingMutation.mutate,
    isDeleting: deleteSettingMutation.isPending,
  };
};
