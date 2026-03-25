import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { getMe } from "../api/user";

export const useLogin = () => {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setAuth = useAuthStore((s) => s.setAuth);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post("/login/", data);
            return res.data;
        },
        onSuccess: async (data) => {
            // 1. Store token in store
            setAccessToken(data.access);
            
            // 2. Fetch the user profile (me) using the new token
            try {
                const userData = await getMe();
                setAuth(userData);
                // 3. Invalidate query cache for "me"
                queryClient.invalidateQueries({ queryKey: ["me"] });
            } catch (err) {
                console.error("FAILED_TO_FETCH_ME_AFTER_LOGIN:", err);
            }
        },
    });
};
