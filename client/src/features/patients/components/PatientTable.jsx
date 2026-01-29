import { useState } from "react";
import {
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useUpdatePatient, useDeletePatient } from "../api/usePatientMutations";

export function PatientTable({ patients, pagination, onPageChange }) {
  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

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
  };

  const handleSaveClick = (id) => {
    updateMutation.mutate(
      { id, data: editFormData },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditFormData({});
        },
      },
    );
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

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleWhatsApp = (phoneNumber) => {
    const cleanNumber = phoneNumber?.replace(/[^0-9]/g, "");
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  // List of departments
  const departments = [
    "General Practitioner",
    "Pediatrics",
    "Cardiology",
    "Orthopedics",
    "Gynecology",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {patients.length === 0 ? (
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
                    (pagination.currentPage - 1) * pagination.patientsPerPage +
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
                                departments.includes(editFormData.department)
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
                            {!departments.includes(editFormData.department) && (
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
                              onClick={() => handleCall(patient.phoneNumber)}
                              className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                              title={`Call ${patient.phoneNumber}`}
                            >
                              <Phone size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleWhatsApp(
                                  patient.whatsappNumber || patient.phoneNumber,
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
                  {(pagination.currentPage - 1) * pagination.patientsPerPage +
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
                <span className="font-medium">{pagination.totalPatients}</span>{" "}
                results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(pageNumber - pagination.currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => onPageChange(pageNumber)}
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
                        <span key={pageNumber} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
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
  );
}
