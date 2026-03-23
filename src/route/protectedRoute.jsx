import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Your login flow stores these keys (see `src/auth/Login.jsx`)
  const isAuthenticated =
    Boolean(localStorage.getItem("id")) ||
    Boolean(localStorage.getItem("name")) ||
    Boolean(localStorage.getItem("adminId")) ||
    Boolean(localStorage.getItem("adminName"));

  // Requirement: unauthenticated users should only reach the home page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
