import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // state
      user: null,
      accessToken: null,
      isLoading: false,

      // derived state
      get isAuthenticated() {
        return !!get().accessToken;
      },

      // actions
      setLoading: (value) => set({ isLoading: value }),

      setAccessToken: (token) => set({ accessToken: token }),

      setUser: (user) => set({ user }),

      login: (token, user) =>
        set({
          user,
          accessToken: token,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: ({ accessToken, user }) => ({ accessToken, user }),
    },
  ),
);
