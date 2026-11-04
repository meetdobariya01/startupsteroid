import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ CRITICAL
  timeout: 15000,
});

let accessToken = null;
export const setAccessToken = (t) => (accessToken = t);
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || "";

    if (
      status === 401 &&
      !original._retry &&
      !url.includes("/auth/refresh") &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/signup") &&
      !url.includes("/auth/google")
    ) {
      original._retry = true;

      try {
        // ✅ FIX: Explicitly pass withCredentials
        refreshing =
          refreshing ||
          api.post("/api/auth/refresh", {}, { withCredentials: true }).finally(() => (refreshing = null));

        const { data } = await refreshing;
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        setAccessToken(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;