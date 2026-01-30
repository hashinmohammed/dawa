import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  Activity,
  TrendingUp,
  Calendar,
  X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PATH } from "../../constants/path";
import { useAdminStats } from "../../features/admin/api/useAdminStats";
import { StatsCard } from "../../features/admin/components/StatsCard";
import { AnalyticsCharts } from "../../features/admin/components/AnalyticsCharts";
import { AdminLayout } from "../../features/admin/components/AdminLayout";

export function Admin() {
  const [dateRange, setDateRange] = useState({
    fromDate: null,
    toDate: null,
  });

  const {
    data: stats,
    isLoading,
    isError,
  } = useAdminStats({
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
  });

  const handleDateChange = (key, date) => {
    setDateRange((prev) => ({ ...prev, [key]: date }));
  };

  const clearFilters = () => {
    setDateRange({ fromDate: null, toDate: null });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="flex justify-center p-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error loading dashboard statistics.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Date Filters */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              size={16}
            />
            <DatePicker
              selected={dateRange.fromDate}
              onChange={(date) => handleDateChange("fromDate", date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="From Date"
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
              maxDate={new Date()}
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              size={16}
            />
            <DatePicker
              selected={dateRange.toDate}
              onChange={(date) => handleDateChange("toDate", date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="To Date"
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
              minDate={dateRange.fromDate}
              maxDate={new Date()}
            />
          </div>
          {(dateRange.fromDate || dateRange.toDate) && (
            <button
              onClick={clearFilters}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Clear Dates"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={<Users size={24} />}
          color="bg-indigo-100"
        />
        <StatsCard
          title="New Today"
          value={stats?.newPatientsToday || 0}
          icon={<UserPlus size={24} />}
          color="bg-green-100"
        />
        <StatsCard
          title="Active Doctors"
          value="5"
          icon={<Activity size={24} />}
          color="bg-purple-100"
        />
        <StatsCard
          title="Growth Rate"
          value="+12%"
          icon={<TrendingUp size={24} />}
          color="bg-orange-100"
        />
      </div>

      {/* Charts */}
      <AnalyticsCharts
        registrationData={stats?.registrationHistory || []}
        departmentData={stats?.patientsByDepartment || []}
      />
    </AdminLayout>
  );
}
