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
    // Standard secure cookie format for production and development
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `accessToken=${token}; path=/; Max-Age=${maxAge}; SameSite=Lax;`;
  } else {
    document.cookie = 'accessToken=; path=/; Max-Age=0;';
  }
};