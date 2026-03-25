// hooks/useCurrentUser.js
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/user";
import { useAuthStore } from "@/store/useAuthStore";

export const useCurrentUser = () => {
    const token = useAuthStore((s) => s.accessToken);

    return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    enabled: !!token,
    });
};
