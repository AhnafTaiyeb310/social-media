import AxiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect, useState } from "react"


export const useAuthCheck = ()=> {
    const {setAuth, logout} = useAuthStore()
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        const checkAuth = async ()=> {
            try {
                const response = await AxiosInstance.get("/users/profile/me/");
                setAuth(response.data)
            } catch (error) {
                logout()
            } finally { setIsLoading (false)}
        }

        checkAuth();
    }, [setAuth, logout])

    return {isLoading};
} 