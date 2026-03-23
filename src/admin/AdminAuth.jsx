import React from "react";
import { Navigate } from "react-router-dom";

const AdminAuth = (WrappedComponent) => {
  return function ProtectedAdmin(props) {
    const adminId = localStorage.getItem("adminId");
    const adminName = localStorage.getItem("adminName");

    if (!adminId || !adminName) {
      return <Navigate to="/AdminLogin" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default AdminAuth;
