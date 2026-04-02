import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { clearAuthSession, getAccessToken, setAuthSession, getStoredUser } from "./auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let pendingRequests = [];

const resolvePendingRequests = (token) => {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
};

const extractAccessToken = (payload = {}) =>
  payload.accessToken || payload.token || payload?.data?.accessToken || "";

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url === "/auth/refresh") {
      clearAuthSession();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (!token) {
            reject(error);
            return;
          }

          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await refreshClient.post("/auth/refresh");
      const nextAccessToken = extractAccessToken(refreshResponse.data);

      if (!nextAccessToken) {
        throw new Error("Refresh token response did not include an access token.");
      }

      setAuthSession({
        accessToken: nextAccessToken,
        user: getStoredUser(),
      });

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      resolvePendingRequests(nextAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      resolvePendingRequests("");
      clearAuthSession();
      window.location.replace("/login");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
