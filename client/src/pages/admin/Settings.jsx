import { useState } from "react";
import { AdminLayout } from "../../features/admin/components/AdminLayout";
import { useSettings } from "../../features/admin/api/useSettings";
import { Plus, X, Building2, ShieldCheck, Loader2 } from "lucide-react";

export function Settings() {
  const { settings, isLoading, isError, addValue, deleteValue, isAdding } =
    useSettings();
  const [newDepartment, setNewDepartment] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (newDepartment.trim()) {
      addValue({ key: "departments", value: newDepartment.trim() });
      setNewDepartment("");
    }
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRole.trim()) {
      addValue({ key: "roles", value: newRole.trim().toLowerCase() });
      setNewRole("");
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
            Error loading settings.
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Departments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Building2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Departments</h2>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-4">
              Manage clinical departments available for patients.
            </div>
            <div className="flex flex-wrap gap-2">
              {settings?.departments?.map((dept) => (
                <div
                  key={dept}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-100 group"
                >
                  <span>{dept}</span>
                  <button
                    onClick={() =>
                      deleteValue({ key: "departments", value: dept })
                    }
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {settings?.departments?.length === 0 && (
                <span className="text-sm text-gray-400 italic">
                  No departments added yet.
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleAddDepartment} className="flex gap-2">
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Enter new department..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!newDepartment.trim() || isAdding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isAdding ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Add
            </button>
          </form>
        </div>

        {/* Roles Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">User Roles</h2>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-4">
              Manage system roles for staff members. 'Admin' cannot be removed.
            </div>
            <div className="flex flex-wrap gap-2">
              {settings?.roles?.map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-100 group capitalize"
                >
                  <span>{role}</span>
                  {role !== "admin" && (
                    <button
                      onClick={() => deleteValue({ key: "roles", value: role })}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddRole} className="flex gap-2 mb-8">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Enter new role..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!newRole.trim() || isAdding}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isAdding ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Add
            </button>
          </form>

          {/* Signup Configuration */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Signup Configuration
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-700">
                  Allow Admin Registration
                </div>
                <div className="text-sm text-gray-500">
                  Show 'Admin' option in signup page
                </div>
              </div>
              <button
                onClick={() => {
                  const isEnabled =
                    settings?.signupFlags?.includes("admin_signup");
                  if (isEnabled) {
                    deleteValue({ key: "signup_flags", value: "admin_signup" });
                  } else {
                    addValue({ key: "signup_flags", value: "admin_signup" });
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  settings?.signupFlags?.includes("admin_signup")
                    ? "bg-purple-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings?.signupFlags?.includes("admin_signup")
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
