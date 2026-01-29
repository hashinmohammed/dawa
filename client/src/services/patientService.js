import { client } from "../lib/axios";

export const patientService = {
  getPatients: async ({
    page = 1,
    limit = 10,
    department,
    doctor,
    search,
    date,
    sortOrder,
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (department) params.append("department", department);
    if (doctor) params.append("doctor", doctor);
    if (search) params.append("search", search);

    if (date) {
      // Format date in local timezone as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      params.append("date", dateStr);
    }

    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await client.get(`/api/patients?${params.toString()}`);
    return response.data;
  },
};
