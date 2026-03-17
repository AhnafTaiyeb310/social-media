import { create } from "zustand";
import { persist } from "zustand/middleware";

// We use the persist middleware so the user stays logged in on page refresh
export const useAuthStore = create(
    persist(
    (set) => ({
        user: null,
        isAuthenticated: false,
        setAuth: (user) => set({user, isAuthenticated: !!user}),
        logout: () => set({
            user: null,
            isAuthenticated: false        
        }),
    }),
    { name: "auth-storage" }
    ),
);
