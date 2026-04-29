"use client";

import { getMe } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

function AuthProvider({ children }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    // Attempt to load user on first mount using the http-only cookie
    const initAuth = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch (err) {
        console.log("AUTH INIT FAILED / user not logged in");
      }
    };

    initAuth();
  }, [setUser]);

  return children;
}

export default AuthProvider;
