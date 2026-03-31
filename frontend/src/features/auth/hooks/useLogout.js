import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { logoutRequest } from "../api/authApi";

export const useLogout = ()=> {
    const logout = useAuthStore(s=> s.logout);
    const router = useRouter();

    const handleLogout = async ()=> {
        try{
            await logoutRequest();
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            logout();
            router.push("/login")
        }
    }
    return handleLogout;
}
