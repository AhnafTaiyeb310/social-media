import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export const login = async (username, password) => {
    const res = await api.post("/login/", { username, password });

    useAuthStore.getState().setAccessToken(res.data.access);
};
