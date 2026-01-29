import { client } from "../../../lib/axios";

/**
 * Get patients with filtering, sorting and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>}
 */
const getPatients = async ({
  page = 1,
  limit = 10,
  department,
  doctor,
  search,
  fromDate,
  toDate,
  sortOrder,
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (department) params.append("department", department);
  if (doctor) params.append("doctor", doctor);
  if (search) params.append("search", search);

  if (fromDate) {
    const year = fromDate.getFullYear();
    const month = String(fromDate.getMonth() + 1).padStart(2, "0");
    const day = String(fromDate.getDate()).padStart(2, "0");
    params.append("fromDate", `${year}-${month}-${day}`);
  }

  if (toDate) {
    const year = toDate.getFullYear();
    const month = String(toDate.getMonth() + 1).padStart(2, "0");
    const day = String(toDate.getDate()).padStart(2, "0");
    params.append("toDate", `${year}-${month}-${day}`);
  }

  if (sortOrder) params.append("sortOrder", sortOrder);

  const response = await client.get(`/api/patients?${params.toString()}`);
  return response.data;
};

/**
 * Register a new patient
 * @param {Object} data - Patient data
 * @returns {Promise<Object>}
 */
const registerPatient = async (data) => {
  const response = await client.post("/api/patients", data);
  return response.data;
};

/**
 * Update an existing patient
 * @param {string} id - Patient ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>}
 */
const updatePatient = async (id, data) => {
  const response = await client.put(`/api/patients/${id}`, data);
  return response.data;
};

/**
 * Delete a patient
 * @param {string} id - Patient ID
 * @returns {Promise<Object>}
 */
const deletePatient = async (id) => {
  const response = await client.delete(`/api/patients/${id}`);
  return response.data;
};

export const patientService = {
  getPatients,
  registerPatient,
  updatePatient,
  deletePatient,
};
