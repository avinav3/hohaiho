import { Navigate, Outlet } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../utils/auth";

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <Outlet />;
};

export default ProtectedRoute;
