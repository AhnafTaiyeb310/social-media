"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function AuthProvider({ children }) {
    const { isLoading } = useAuthCheck();

    if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
    }

    return <>{children}</>;
}