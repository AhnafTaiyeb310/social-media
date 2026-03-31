"use client";

import { getMe } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

function AuthProvider({ children }) {
    const accessToken = useAuthStore((s) => s.accessToken);
    const setUser = useAuthStore((s) => s.setUser);

    useEffect(() => {
    if (!accessToken) return;

    const initAuth = async () => {
        try {
        const user = await getMe();
        setUser(user);
        } catch (err) {
        console.log("AUTH ERROR:", err);
        }
    };

    initAuth();
    }, [accessToken]);

    return children;
}

export default AuthProvider;
