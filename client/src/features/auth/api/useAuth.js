import { useQuery } from "@tanstack/react-query";
import { client } from "../../../lib/axios";

/**
 * Hook to fetch the current user's profile from the API
 */
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await client.get("/api/auth/me");
      return response.data;
    },
    // Only fetch if we have an access token (handled by global axios interceptor essentially,
    // but good to be explicit if we had logic). The failure will be handled by the interceptor
    // or error boundary.
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
