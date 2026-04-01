import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation"; 
import { useState } from "react";
import { loginRequest } from "../api/authApi";

export function useLogin(){
  const router = useRouter();
  const login = useAuthStore(s=> s.login);
  const setLoading = useAuthStore(s=> s.setLoading);
  const [error, setError] = useState(false);

  const handleLogin = async (data)=> {
    try {
      setLoading(true);
      setError(null);

      const res = await loginRequest(data)
      login(res.access, res.user)
      router.push("/")
      console.log("logged in")
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Login failed");
    } finally {

      setLoading(false)
    }
  }

  return { handleLogin, error };
}