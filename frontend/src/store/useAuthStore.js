import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            isAuthenticated: false,

            setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
            
            setAuth: (user) => set({ user, isAuthenticated: !!user }),
            
            logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ 
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated 
            }),
        }
    )
);
