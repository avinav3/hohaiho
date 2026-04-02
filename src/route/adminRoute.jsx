import { Navigate, Outlet } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../utils/auth";

const AdminRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/AdminLogin" replace />;
  }

  return isAdmin() ? <Outlet /> : <Navigate to="/Dashboard" replace />;
};

export default AdminRoute;
