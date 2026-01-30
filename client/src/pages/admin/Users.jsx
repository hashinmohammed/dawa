import { useState } from "react";
import {
  Users as UsersIcon,
  Shield,
  Stethoscope,
  HeartPulse,
  User,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "../../features/admin/components/AdminLayout";
import { useUserStats } from "../../features/admin/api/useUserStats";
import { useUsers } from "../../features/admin/api/useUsers";
import { useUserMutations } from "../../features/admin/api/useUserMutations";
import { StatsCard } from "../../features/admin/components/StatsCard";

export function Users() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useUserStats();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();
  const { deleteUser } = useUserMutations();

  const [selectedRole, setSelectedRole] = useState("all");

  const getRoleConfig = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return {
          icon: <Shield size={18} />,
          color: "bg-purple-100 text-purple-600",
        };
      case "doctor":
        return {
          icon: <Stethoscope size={18} />,
          color: "bg-indigo-100 text-indigo-600",
        };
      case "nurse":
        return {
          icon: <HeartPulse size={18} />,
          color: "bg-pink-100 text-pink-600",
        };
      default:
        return { icon: <User size={18} />, color: "bg-gray-100 text-gray-600" };
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(id);
    }
  };

  const filteredUsers =
    selectedRole === "all"
      ? users
      : users?.filter((user) => user.role === selectedRole);

  if (statsLoading || usersLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (statsError || usersError) {
    return (
      <AdminLayout>
        <div className="flex justify-center p-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error loading data.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">User Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Users Card */}
        <div
          onClick={() => setSelectedRole("all")}
          className={`cursor-pointer transition-all ${selectedRole === "all" ? "ring-2 ring-indigo-500 transform scale-105" : "hover:scale-105"}`}
        >
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<UsersIcon size={24} />}
            color="bg-blue-100"
          />
        </div>

        {/* Dynamic Role Cards */}
        {stats?.roleStats?.map((stat) => {
          const role = stat.role || "Unknown";
          const config = getRoleConfig(role);
          const cardBgColor = config.color.split(" ")[0];

          return (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`cursor-pointer transition-all ${selectedRole === role ? "ring-2 ring-indigo-500 transform scale-105" : "hover:scale-105"}`}
            >
              <StatsCard
                title={role.charAt(0).toUpperCase() + role.slice(1) + "s"}
                value={stat.count}
                icon={config.icon}
                color={cardBgColor}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {selectedRole === "all"
            ? "All Users"
            : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}s`}
        </h2>
        <span className="text-sm text-gray-500">
          {filteredUsers?.length || 0} members
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers?.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                return (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}
                      >
                        {roleConfig.icon}
                        <span className="capitalize">
                          {user.role || "Unknown"}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.phoneNumber}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers?.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No users found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
