"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(6, "Password confirmation is required"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

export default function RegisterPage() {
  const router = useRouter();
  const { setAccessToken, setAuth, isAuthenticated } = useAuthStore();

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
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("REGISTRATION_SUCCESS");
      if (data.access) {
        setAccessToken(data.access);
        if (data.user) {
            setAuth(data.user);
        }
        router.replace("/");
        router.refresh();
      } else {
        router.push("/login");
      }
    },
    onError: (err) => {
      console.error("REGISTER_ERROR:", err.response?.data);
      // Handle Django's potential field-specific errors
      const data = err.response?.data;
      if (data) {
        Object.keys(data).forEach((key) => {
          setError(key, { message: Array.isArray(data[key]) ? data[key][0] : data[key] });
        });
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-lg border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

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
              {...register("username")}
              placeholder="Username"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 p-2.5 text-black dark:text-white bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                {...register("first_name")}
                placeholder="First Name"
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 p-2.5 text-black dark:text-white bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                {...register("last_name")}
                placeholder="Last Name"
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 p-2.5 text-black dark:text-white bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

          <div>
            <input
              {...register("confirm_password")}
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 p-2.5 text-black dark:text-white bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-blue-600 p-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
