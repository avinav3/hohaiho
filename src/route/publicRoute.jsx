import { Navigate, Outlet } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../utils/auth";

const PublicRoute = () => {
  if (!isAuthenticated()) {
    return <Outlet />;
  }

  return isAdmin() ? <Navigate to="/AdminDashboard" replace /> : <Navigate to="/Dashboard" replace />;
};

export default PublicRoute;
