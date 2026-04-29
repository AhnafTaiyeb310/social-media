import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'sonner';
import { followUser, getMe, getProfile, getSuggestions, loginRequest } from "../api/authApi";

export function useLogin(){
  const router = useRouter();
  const login = useAuthStore(s=> s.login);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data)=> {
    try {
      setIsLoading(true);
      setError(null);

      const res = await loginRequest(data)
      login(res.user)
      toast.success(`Welcome back to Sync! 👋`)
      router.push("/")
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || "Login failed");
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLogin, error, isLoading };
}

export const useMe = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMe,
  });
};

export const useProfile = (username) => {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username),
    enabled: !!username,
  });
};

export const useSuggestions = () => {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: getSuggestions,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId) => followUser(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

import { facebookLoginRequest, googleLoginRequest } from "../api/authApi";

export function useSocialAuth() {
  const router = useRouter();
  const login = useAuthStore(s => s.login);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await googleLoginRequest(token);
      login(res.user);
      toast.success('Logged in with Google! 🎉');
      router.push("/");
    } catch (err) {
      setError("Google Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async (token) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await facebookLoginRequest(token);
      login(res.user);
      toast.success('Logged in with Facebook! 🎉');
      router.push("/");
    } catch (err) {
      setError("Facebook Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGoogleLogin, handleFacebookLogin, error, isLoading };
}
