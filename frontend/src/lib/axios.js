import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

// Axios Interceptor Instance
const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true
});

// Axios Interceptor: Request Method
AxiosInstance.interceptors.request.use(
    (config) => config,

    (error) => Promise.reject(error),
    );

// Axios Interceptor: Response Method
AxiosInstance.interceptors.response.use(
    (response) => {
        // Can be modified response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // network error (no response)
        if (!error.response) {
            return Promise.reject(error)
        }

        // unathorized & not retried
        if(error.response?.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/token/refresh/`, {}, { withCredentials: true });
                return AxiosInstance(originalRequest)
            } catch(refreshError) {
                useAuthStore.getState().logout();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        
        }
        return Promise.reject(error);
    }
)

export default AxiosInstance;