import { client } from "../../../lib/axios";

export const adminService = {
  getStats: async (params) => {
    const response = await client.get("/api/admin/stats", { params });
    return response.data;
  },
  getUserStats: async () => {
    const response = await client.get("/api/admin/users/stats");
    return response.data;
  },
};
