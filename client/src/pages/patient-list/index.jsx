import { useState, useEffect } from "react";
import { Phone, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { client } from "../../lib/axios";
import customToast from "../../shared/ui/customToast";

export function PatientList() {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPatients: 0,
    patientsPerPage: 10,
  });
  const [loading, setLoading] = useState(true);

  const fetchPatients = async (page = 1) => {
    try {
      setLoading(true);
      const response = await client.get(`/api/patients?page=${page}&limit=10`);
      setPatients(response.data.patients);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching patients:", error);
      customToast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPatients(newPage);
    }
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber) => {
    // Remove any spaces or special characters
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Records
          </h1>
          <p className="text-gray-600">
            Total Patients: {pagination.totalPatients}
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient, index) => {
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
                            <div className="text-sm font-medium text-gray-900">
                              {patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.sex}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {patient.age}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {patient.department}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {patient.doctor}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {patient.place}
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
      </div>
    </div>
  );
}
