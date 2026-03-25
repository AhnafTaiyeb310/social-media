"use client";

import { useAuthStore } from "@/store/useAuthStore";
import api from "../lib/axios";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/features/auth/components/protectedRoutes";

export default function Home() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post("/logout/");
            console.log("Successfully logged out from server");
        } catch (err) {
            console.warn("Logout request failed, clearing local state anyway:", err);
        } finally {
            logout();
            router.push("/login");
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-24 bg-zinc-50 dark:bg-black">
                <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 text-center w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                    {user ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
                                    {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-semibold text-black dark:text-white">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p className="text-zinc-500 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="animate-pulse space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="h-4 w-3/4 mx-auto bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                            <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
