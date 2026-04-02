import api from "./api";
import { clearAuthSession, isAdmin } from "./auth";

const logout = async ({ navigate, redirectTo } = {}) => {
  const shouldRedirectToAdmin = isAdmin();

  try {
    await api.post("/auth/logout");
  } catch (error) {
    if (error?.response?.status !== 404) {
      console.error("Logout request failed:", error);
    } else {
      try {
        await api.post("/logout");
      } catch (fallbackError) {
        console.error("Fallback logout request failed:", fallbackError);
      }
    }
  } finally {
    clearAuthSession();
    sessionStorage.clear();

    const destination = redirectTo || (shouldRedirectToAdmin ? "/AdminLogin" : "/login");

    if (navigate) {
      navigate(destination, { replace: true });
    } else {
      window.location.replace(destination);
    }
  }
};

export default logout;
