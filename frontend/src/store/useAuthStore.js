import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // state
      user: null,
      isLoading: false,

      // derived state
      get isAuthenticated() {
        return !!get().user;
      },

      // actions
      setLoading: (value) => set({ isLoading: value }),

      setUser: (user) => set({ user }),

      login: (user) => {
        set({
          user,
        });
      },

      logout: async () => {
        try {
           // We ping logout on backend to clear http-only cookies
           await api.post("/auth/logout/");
        } catch (e) {
           console.error("Logout failed on server:", e);
        } finally {
          set({
            user: null,
            isLoading: false,
          });
        }
      },
    }),

    {
      name: 'auth-storage',
      partialize: ({ user }) => ({ user }),
    },
  ),
);