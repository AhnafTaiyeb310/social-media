import { useMutation } from "@tanstack/react-query";
import { googleLoginRequest, facebookLoginRequest } from "../api/socialLogin";
import { useAuthStore } from "@/store/useAuthStore";

export const useGoogleLogin = () => {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    return useMutation({
    mutationFn: googleLoginRequest,
    onSuccess: (data) => {
        setAccessToken(data.access);
    },
    });
};

export const useFacebookLogin = () => {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    return useMutation({
    mutationFn: facebookLoginRequest,
    onSuccess: (data) => {
        setAccessToken(data.access);
    },
    });
};