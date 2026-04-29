import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Critical: sends cookies with every request
});

// 1. CSRF Interceptor
api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get("csrftoken"); // Read from frontend cookie
  if (csrfToken && config.method !== "get") {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 2. Token Refresh Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Condition: 401, haven't retried yet, and isn't the refresh/login endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/")) {
      originalRequest._retry = true;
      try {
        // Ping refresh endpoint. Backend reads 'refresh' cookie, issues new 'access' cookie.
        await axios.post(`${api.defaults.baseURL}/auth/token/refresh/`, {}, { withCredentials: true });
        return api(originalRequest); // Retry original
      } catch (refreshError) {
        // Use auth store to handle client-side state
        import('@/store/useAuthStore').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        });
        
        if (typeof window !== 'undefined') {
          const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
          if (!isAuthPage) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
