import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    "http://127.0.0.1:8000/api/refresh/",
                    {},
                    { withCredentials: true },
                );

                const newAccess = res.data.access;

                useAuthStore.getState().setAccessToken(newAccess);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                return api(originalRequest);
            } catch (err) {
                useAuthStore.getState().logout();
            }
        }

        return Promise.reject(error);
    },
);

export const registerUser = async (data) => {
    const res = await api.post("/register/", data);
    return res.data;
};

export default api;
