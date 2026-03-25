// hooks/useLogout.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const logout = useAuthStore((s) => s.logout);

    return useMutation({
    mutationFn: async () => {
        await api.post("/logout/");
    },
    onSuccess: () => {
        logout();
        queryClient.clear();
    },
    });
};
