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

      setAccessToken: (token) => {
        set({ accessToken: token });
        setAccessTokenCookie(token);
      },

      setUser: (user) => set({ user }),

      login: (token, user) => {
        set({
          user,
          accessToken: token,
        });
        setAccessTokenCookie(token);
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isLoading: false,
        });
        setAccessTokenCookie(null);
      },
    }),

    {
      name: 'auth-storage',
      partialize: ({ accessToken, user }) => ({ accessToken, user }),
    },
  ),
);


// set access token in cookie just for proxy to redirect unauth user
const setAccessTokenCookie = (token) => {
  if (typeof document === 'undefined') return;

  if (token) {
    // Keep cookie for 7 days, match SameSite with Lax for better compatibility
    document.cookie = `accessToken=${token}; path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure;`;
  } else {
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
  }
};