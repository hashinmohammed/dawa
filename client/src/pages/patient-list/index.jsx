import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  X,
  Calendar,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import customToast from "../../shared/ui/customToast";
import { patientService } from "../../services/patientService";
import { QUERY_KEYS } from "../../constants/keys";

import { Header } from "../../shared/ui/Header";

export function PatientList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    department: "",
    doctor: "",
    search: "",
    date: null,
    sortOrder: "desc", // desc = newest first, asc = oldest first
  });

  const {
    data,
    isLoading: loading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.PATIENTS, page, filters],
    queryFn: () => patientService.getPatients({ page, ...filters }),
    placeholderData: keepPreviousData,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
    onSuccess: () => {
      customToast.success("Patient updated successfully");
      setEditingId(null);
      queryClient.invalidateQueries([QUERY_KEYS.PATIENTS]);
    },
    onError: (err) => {
      customToast.error(err.response?.data?.message || "Failed to update");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => patientService.deletePatient(id),
    onSuccess: () => {
      customToast.success("Patient deleted successfully");
      queryClient.invalidateQueries([QUERY_KEYS.PATIENTS]);
    },
    onError: (err) => {
      customToast.error(err.response?.data?.message || "Failed to delete");
    },
  });

  useEffect(() => {
    if (isError) {
      customToast.error("Failed to load patients");
      console.error(error);
    }
  }, [isError, error]);

  const patients = data?.patients || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalPatients: 0,
    patientsPerPage: 10,
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filtering
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      department: "",
      doctor: "",
      search: "",
      date: null,
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setPage(1);
  };

  const toggleSort = () => {
    const newSortOrder = filters.sortOrder === "desc" ? "asc" : "desc";
    handleFilterChange("sortOrder", newSortOrder);
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleWhatsApp = (phoneNumber) => {
    // Remove any spaces or special characters
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  // Edit Handlers
  const handleEditClick = (patient) => {
    setEditingId(patient._id);
    setEditFormData({
      name: patient.name,
      age: patient.age,
      sex: patient.sex,
      place: patient.place,
      department: patient.department,
      doctor: patient.doctor,
      phoneNumber: patient.phoneNumber,
      whatsappNumber: patient.whatsappNumber,
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
    // Reset mutations if needed? No need.
  };

  const handleSaveClick = (id) => {
    updateMutation.mutate({ id, data: editFormData });
  };

  const handleDeleteClick = (id) => {
    if (
      window.confirm("Are you sure you want to delete this patient record?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // List of departments (same as in registration form)
  const departments = [
    "General Practitioner",
    "Pediatrics",
    "Cardiology",
    "Orthopedics",
    "Gynecology",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Records
          </h1>
          <p className="text-gray-600">
            Total Patients: {pagination.totalPatients}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Enter patient name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor
              </label>
              <input
                type="text"
                value={filters.doctor}
                onChange={(e) => handleFilterChange("doctor", e.target.value)}
                placeholder="Enter doctor name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
                  size={18}
                />
                <DatePicker
                  selected={filters.date}
                  onChange={(date) => handleFilterChange("date", date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxDate={new Date()}
                  isClearable
                />
              </div>
            </div>

            {/* Sort & Clear */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by Time
                </label>
                <button
                  onClick={toggleSort}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <ArrowUpDown size={16} />
                  {filters.sortOrder === "desc" ? "Newest" : "Oldest"}
                </button>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                title="Clear all filters"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading || (isFetching && patients.length === 0) ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No patients found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        SL#
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Age
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Doctor
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Place
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Booking Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Registered By
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient, index) => {
                      const isEditing = editingId === patient._id;
                      const serialNumber =
                        (pagination.currentPage - 1) *
                          pagination.patientsPerPage +
                        index +
                        1;

                      // Format booking time
                      const bookingDate = new Date(patient.createdAt);
                      const formattedDate = bookingDate.toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      );
                      const formattedTime = bookingDate.toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      );

                      return (
                        <tr
                          key={patient._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {serialNumber}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name}
                                  onChange={handleEditFormChange}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                  placeholder="Name"
                                />
                                <select
                                  name="sex"
                                  value={editFormData.sex}
                                  onChange={handleEditFormChange}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-gray-900">
                                  {patient.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {patient.sex}
                                </div>
                              </>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {isEditing ? (
                              <input
                                type="number"
                                name="age"
                                value={editFormData.age}
                                onChange={handleEditFormChange}
                                className="w-16 px-2 py-1 text-sm border rounded"
                              />
                            ) : (
                              patient.age
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {isEditing ? (
                              <div className="space-y-1">
                                <select
                                  name="department"
                                  value={
                                    departments.includes(
                                      editFormData.department,
                                    )
                                      ? editFormData.department
                                      : "Other"
                                  }
                                  onChange={(e) => {
                                    if (e.target.value === "Other") {
                                      setEditFormData((prev) => ({
                                        ...prev,
                                        department: "",
                                      }));
                                    } else {
                                      handleEditFormChange(e);
                                    }
                                  }}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                >
                                  {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                      {dept}
                                    </option>
                                  ))}
                                  <option value="Other">Other</option>
                                </select>
                                {!departments.includes(
                                  editFormData.department,
                                ) && (
                                  <input
                                    type="text"
                                    name="department"
                                    value={editFormData.department}
                                    onChange={handleEditFormChange}
                                    placeholder="Enter department"
                                    className="w-full px-2 py-1 text-sm border rounded"
                                    autoFocus
                                  />
                                )}
                              </div>
                            ) : (
                              patient.department
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {isEditing ? (
                              <input
                                type="text"
                                name="doctor"
                                value={editFormData.doctor}
                                onChange={handleEditFormChange}
                                className="w-full px-2 py-1 text-sm border rounded"
                              />
                            ) : (
                              patient.doctor
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {isEditing ? (
                              <input
                                type="text"
                                name="place"
                                value={editFormData.place}
                                onChange={handleEditFormChange}
                                className="w-full px-2 py-1 text-sm border rounded"
                              />
                            ) : (
                              patient.place
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {formattedDate}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formattedTime}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.registeredBy?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {patient.registeredBy?.role ||
                                patient.createdByRole ||
                                "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  name="phoneNumber"
                                  value={editFormData.phoneNumber}
                                  onChange={handleEditFormChange}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                  placeholder="Phone"
                                />
                                <input
                                  type="text"
                                  name="whatsappNumber"
                                  value={editFormData.whatsappNumber}
                                  onChange={handleEditFormChange}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                  placeholder="WhatsApp"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    handleCall(patient.phoneNumber)
                                  }
                                  className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                  title={`Call ${patient.phoneNumber}`}
                                >
                                  <Phone size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleWhatsApp(
                                      patient.whatsappNumber ||
                                        patient.phoneNumber,
                                    )
                                  }
                                  className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                                  title={`WhatsApp ${patient.whatsappNumber || patient.phoneNumber}`}
                                >
                                  <MessageCircle size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSaveClick(patient._id)}
                                  className="p-1 text-white bg-green-600 rounded hover:bg-green-700"
                                  title="Save"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={handleCancelClick}
                                  className="p-1 text-white bg-red-600 rounded hover:bg-red-700"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditClick(patient)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(patient._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) *
                        pagination.patientsPerPage +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.patientsPerPage,
                        pagination.totalPatients,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {pagination.totalPatients}
                    </span>{" "}
                    results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          pageNumber === 1 ||
                          pageNumber === pagination.totalPages ||
                          Math.abs(pageNumber - pagination.currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                pageNumber === pagination.currentPage
                                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white"
                                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === pagination.currentPage - 2 ||
                          pageNumber === pagination.currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="px-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
