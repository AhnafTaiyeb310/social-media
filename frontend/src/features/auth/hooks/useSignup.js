import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'sonner';
import { signupRequest } from "../api/authApi";

export const useSignup = ()=> {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (data)=> {
    try {
      setIsLoading(true);
      setError(false);
      setIsSuccess(false);

      await signupRequest(data);
      setIsSuccess(true);
      toast.success('Account created! Check your email to verify. 📧');
      // Wait a bit before redirecting or stay on page to show message
      // router.push("/login")

    } catch (error) {
      setError(error.response?.data || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }
  return { handleSignup, error, isLoading, isSuccess }
}
