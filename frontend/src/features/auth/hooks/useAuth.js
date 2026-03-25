// hooks/useAuth.js
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = () => {
    const token = useAuthStore((s) => s.accessToken);
    const { data: user, isLoading } = useCurrentUser();

    return {
    isAuthenticated: !!token,
    user,
    isLoading,
    };
};
