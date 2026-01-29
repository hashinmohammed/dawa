import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../../../shared/store/useStore";
import { useUser } from "../api/useAuth";
import { PATH } from "../../../constants/path";

export const AdminRoute = () => {
  const { isAuthenticated } = useStore();
  const { data: user, isLoading, isError } = useUser();

  if (!isAuthenticated) {
    return <Navigate to={PATH.LOGIN} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || user?.role !== "admin") {
    return <Navigate to={PATH.HOME} replace />;
  }

  return <Outlet />;
};
