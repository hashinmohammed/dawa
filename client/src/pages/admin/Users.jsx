import {
  Users as UsersIcon,
  Shield,
  Stethoscope,
  HeartPulse,
  User,
} from "lucide-react";
import { AdminLayout } from "../../features/admin/components/AdminLayout";
import { useUserStats } from "../../features/admin/api/useUserStats";
import { StatsCard } from "../../features/admin/components/StatsCard";

export function Users() {
  const { data: stats, isLoading, isError } = useUserStats();

  const getRoleConfig = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return { icon: <Shield size={24} />, color: "bg-purple-100" };
      case "doctor":
        return { icon: <Stethoscope size={24} />, color: "bg-indigo-100" };
      case "nurse":
        return { icon: <HeartPulse size={24} />, color: "bg-pink-100" };
      default:
        return { icon: <User size={24} />, color: "bg-gray-100" };
    }
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
            Error loading user statistics.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">User Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<UsersIcon size={24} />}
          color="bg-blue-100"
        />

        {/* Dynamic Role Cards */}
        {stats?.roleStats?.map((stat) => {
          const role = stat.role || "Unknown";
          const config = getRoleConfig(role);
          return (
            <StatsCard
              key={role}
              title={role.charAt(0).toUpperCase() + role.slice(1) + "s"}
              value={stat.count}
              icon={config.icon}
              color={config.color}
            />
          );
        })}
      </div>
    </AdminLayout>
  );
}
