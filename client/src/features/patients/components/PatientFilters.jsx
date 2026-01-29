import { useState, useEffect } from "react";
import { Search, Calendar, ArrowUpDown, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useStore } from "../../../shared/store/useStore";
import { useDebounce } from "../../../hooks/useDebounce";

export function PatientFilters() {
  const { patientFilters, setPatientFilters, clearPatientFilters } = useStore();
  const [searchTerm, setSearchTerm] = useState(patientFilters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Update store when debounced search changes
  useEffect(() => {
    // Only update store if the debounced value is different from store to avoid loop
    if (debouncedSearch !== patientFilters.search) {
      setPatientFilters({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, setPatientFilters, patientFilters.search]);

  const handleFilterChange = (key, value) => {
    setPatientFilters({ [key]: value, page: 1 });
  };

  const handleClearFilters = () => {
    clearPatientFilters();
    setSearchTerm("");
  };

  const toggleSort = () => {
    const newSortOrder = patientFilters.sortOrder === "desc" ? "asc" : "desc";
    setPatientFilters({ sortOrder: newSortOrder, page: 1 });
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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            value={patientFilters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
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
            value={patientFilters.doctor}
            onChange={(e) => handleFilterChange("doctor", e.target.value)}
            placeholder="Enter doctor name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Date Filter - From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Date From
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              size={18}
            />
            <DatePicker
              selected={patientFilters.fromDate}
              onChange={(date) => handleFilterChange("fromDate", date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="From date..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              maxDate={new Date()}
              isClearable
            />
          </div>
        </div>

        {/* Date Filter - To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Date To
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              size={18}
            />
            <DatePicker
              selected={patientFilters.toDate}
              onChange={(date) => handleFilterChange("toDate", date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="To date..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              maxDate={new Date()}
              minDate={patientFilters.fromDate}
              isClearable
            />
          </div>
        </div>

        {/* Sort & Clear */}
        <div className="flex items-end gap-2 md:col-span-2 lg:col-span-1">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by Time
            </label>
            <button
              onClick={toggleSort}
              className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <ArrowUpDown size={16} />
              {patientFilters.sortOrder === "desc" ? "Newest" : "Oldest"}
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
  );
}
