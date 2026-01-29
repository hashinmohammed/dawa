import { useEffect } from "react";
import { Header } from "../../shared/ui/Header";
import { useStore } from "../../shared/store/useStore";
import { usePatients } from "../../features/patients/api/usePatients";
import { PatientFilters } from "../../features/patients/components/PatientFilters";
import { PatientTable } from "../../features/patients/components/PatientTable";
import customToast from "../../shared/ui/customToast";

export function PatientList() {
  const { patientFilters, setPatientPage } = useStore();

  const {
    data,
    isLoading: loading,
    isFetching,
    isError,
    error,
  } = usePatients(patientFilters);

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
      setPatientPage(newPage);
    }
  };

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
        <PatientFilters />

        {/* Table */}
        {loading || (isFetching && patients.length === 0) ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-12 text-center">
            <p className="text-gray-500">Loading patients...</p>
          </div>
        ) : (
          <PatientTable
            patients={patients}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}
