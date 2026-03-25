import { getMe } from "@/features/auth/api/user";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export const useAuthCheck = () => {
    const { setAuth, logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try fetching the current user profile. 
                // axios interceptor will handle refresh if access token is expired but refresh cookie exists.
                const user = await getMe();
                setAuth(user);
            } catch (error) {
                console.error("AUTH_CHECK_FAILED:", error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [setAuth, logout]);

    return { isLoading };
};
