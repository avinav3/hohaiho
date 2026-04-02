const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

const safeJsonParse = (value) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || "";

export const getStoredUser = () => {
  const parsedUser = safeJsonParse(localStorage.getItem(USER_KEY));

  if (parsedUser) {
    return parsedUser;
  }

  const id = localStorage.getItem("id") || localStorage.getItem("user_id") || "";
  const name = localStorage.getItem("name") || localStorage.getItem("adminName") || "";
  const role =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    (localStorage.getItem("adminId") ? "admin" : "");

  if (!id && !name && !role) {
    return null;
  }

  return { id, name, role };
};

export const setAuthSession = ({ accessToken, user }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (!user) {
    return;
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));

  if (user.id || user._id || user.user_id) {
    const resolvedId = user.id || user._id || user.user_id;
    localStorage.setItem("id", resolvedId);
    localStorage.setItem("user_id", resolvedId);
  }

  if (user.name) {
    localStorage.setItem("name", user.name);
  }

  if (user.email) {
    localStorage.setItem("email", user.email);
  }

  if (user.lastLogin) {
    localStorage.setItem("lastLogin", user.lastLogin);
  }

  if (user.role) {
    localStorage.setItem("role", user.role);
    localStorage.setItem("userRole", user.role);
  }

  if (String(user.role || "").toLowerCase() === "admin") {
    if (user.name) {
      localStorage.setItem("adminName", user.name);
    }

    if (user.id || user._id || user.user_id) {
      localStorage.setItem("adminId", user.id || user._id || user.user_id);
    }
  } else {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
  }
};

export const clearAuthSession = () => {
  [
    ACCESS_TOKEN_KEY,
    USER_KEY,
    "id",
    "user_id",
    "name",
    "email",
    "role",
    "userRole",
    "lastLogin",
    "adminId",
    "adminName",
  ].forEach((key) => localStorage.removeItem(key));
};

export const isAuthenticated = () => Boolean(getStoredUser());

export const isAdmin = () =>
  String(getStoredUser()?.role || "").toLowerCase() === "admin";
