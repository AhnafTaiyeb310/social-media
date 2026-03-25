// components/ProtectedRoute.js
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        router.push("/login");
    }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return <p>Loading...</p>;

    return children;
}
