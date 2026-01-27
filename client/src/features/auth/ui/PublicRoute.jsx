import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../../../shared/store/useStore";
import { PATH } from "../../../constants/path";

export const PublicRoute = () => {
  const { isAuthenticated } = useStore();

  if (isAuthenticated) {
    return <Navigate to={PATH.HOME} replace />;
  }

  return <Outlet />;
};
