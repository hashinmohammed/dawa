import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Signup } from "../pages/signup";
import { Admin } from "../pages/admin";
import { Users } from "../pages/admin/Users";
import { Settings } from "../pages/admin/Settings";
import { PatientList } from "../pages/patient-list";
import { ProtectedRoute } from "../features/auth/ui/ProtectedRoute";
import { AdminRoute } from "../features/auth/ui/AdminRoute";
import { PublicRoute } from "../features/auth/ui/PublicRoute";
import { PATH } from "../constants/path";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path={PATH.HOME} element={<Home />} />
        <Route path={PATH.PATIENT_LIST} element={<PatientList />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path={PATH.ADMIN} element={<Admin />} />
        <Route path={PATH.ADMIN_USERS} element={<Users />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path={PATH.LOGIN} element={<Login />} />
        <Route path={PATH.SIGNUP} element={<Signup />} />
      </Route>

      <Route path="*" element={<Navigate to={PATH.HOME} replace />} />
    </Routes>
  );
};
