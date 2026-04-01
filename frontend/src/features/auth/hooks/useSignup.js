import { useAuthStore } from "@/store/useAuthStore"
import { useState } from "react"
import { signupRequest } from "../api/authApi"
import { useRouter } from "next/navigation"

export const useSignup = ()=> {
  const setLoading = useAuthStore(s=> s.setLoading)
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSignup = async (data)=> {
    try {
      setLoading(true);
      setError(false);

      await signupRequest(data);
      router.push("/login")

    } catch (error) {
      setError(error.response?.data || "Signup failed")
    } finally {
      setLoading(false)
    }
  }
  return { handleSignup, error }
}
