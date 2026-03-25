"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const mutation = useLogin();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.replace("/");
        router.refresh();
      },
      onError: (err) => {
        console.error("LOGIN_ERROR:", err.response?.data);
        const data = err.response?.data;
        if (data && typeof data === 'object') {
          Object.keys(data).forEach((key) => {
            setError(key, { message: Array.isArray(data[key]) ? data[key][0] : data[key] });
          });
          if (data.error) {
              setError("root", { message: data.error });
          }
        } else {
          setError("root", { message: "Invalid email or password" });
        }
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-lg border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm text-center">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 p-2.5 text-black dark:text-white bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 p-2.5 text-black dark:text-white bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-blue-600 p-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
