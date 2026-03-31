import { useAuthStore } from "@/store/useAuthStore"
import { getMe } from "../api/authApi"
import { useEffect } from "react"

export const useAuth = ()=> {
    const token  = useAuthStore(s=>s.accessToken)
    const setUser = useAuthStore(s=> s.setUser)
    const logout = useAuthStore(s=> s.logout)
    
    useEffect(()=> {
        const fetchUser = async ()=> {
            if (!token) return; 

            try {
                const user = await getMe();
                setUser(user);
            } catch (error) {
                if (error.response?.status === 401) {
                    // logout();
                }
            }
        }
        fetchUser();
    }, [token, setUser, logout])
}
