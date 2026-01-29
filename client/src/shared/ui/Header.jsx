import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { PATH } from "../../constants/path";
import customToast from "./customToast";

export function Header() {
  const { user, logout, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    customToast.success("Logged out successfully!");
    navigate(PATH.LOGIN);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to={PATH.HOME}>
              <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition">
                Dawa Clinic
              </h1>
            </Link>
            {isAuthenticated && (
              <nav className="flex gap-4">
                <Link
                  to={PATH.HOME}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Register Patient
                </Link>
                <Link
                  to={PATH.PATIENT_LIST}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Patient List
                </Link>
              </nav>
            )}
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
