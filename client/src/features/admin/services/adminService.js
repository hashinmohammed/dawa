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
  getUsers: async () => {
    const response = await client.get("/api/admin/users");
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await client.delete(`/api/admin/users/${id}`);
    return response.data;
  },
};
