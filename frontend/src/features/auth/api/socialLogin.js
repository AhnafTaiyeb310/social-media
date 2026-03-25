// features/auth/api/socialLogin.js

import api from "@/lib/axios";

export const googleLoginRequest = async (token) => {
    const res = await api.post("/auth/google/", { token });
    return res.data;
};

export const facebookLoginRequest = async (token) => {
    const res = await api.post("/auth/facebook/", { token });
    return res.data;
};