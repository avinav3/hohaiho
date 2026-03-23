import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  // If already logged in, don't allow visiting login/signup.
  const isAuthenticated =
    Boolean(localStorage.getItem("id")) ||
    Boolean(localStorage.getItem("name")) ||
    Boolean(localStorage.getItem("adminId")) ||
    Boolean(localStorage.getItem("adminName"));

  return isAuthenticated ? <Navigate to="/Dashboard" /> : <Outlet />;
};

export default PublicRoute;