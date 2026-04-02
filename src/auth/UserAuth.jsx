import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../utils/auth";

const UserAuth = (WrappedComponent) => {
  return function AuthHOC(props) {
    const navigate = useNavigate();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
      if (isRedirecting) {
        return;
      }

      if (!isAuthenticated()) {
        setIsRedirecting(true);
        navigate("/login", { replace: true });
        return;
      }

      if (isAdmin()) {
        setIsRedirecting(true);
        navigate("/AdminDashboard", { replace: true });
      }
    }, [navigate, isRedirecting]);

    if (isAuthenticated() && !isAdmin() && !isRedirecting) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default UserAuth;
