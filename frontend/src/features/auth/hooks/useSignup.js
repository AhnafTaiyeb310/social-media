import { useAuthStore } from "@/store/useAuthStore"
import { useState } from "react"
import { signupRequest } from "../api/authApi"
import { useRouter } from "next/navigation"

export const useSignup = ()=> {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (data)=> {
    try {
      setIsLoading(true);
      setError(false);

      await signupRequest(data);
      router.push("/login")

    } catch (error) {
      setError(error.response?.data || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }
  return { handleSignup, error, isLoading }
}
