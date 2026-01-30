import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { PATH } from "../../../constants/path";
import { useStore } from "../../../shared/store/useStore";

export function Sidebar() {
  const location = useLocation();
  const { logout } = useStore();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: PATH.ADMIN,
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: PATH.ADMIN_USERS,
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings", // Placeholder for now
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dawa Admin
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? "bg-indigo-50 text-indigo-600 font-medium shadow-xs"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
