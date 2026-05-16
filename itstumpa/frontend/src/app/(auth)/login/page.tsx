"use client";

import { useAppDispatch } from "@/hooks/redux";
import api from "@/lib/axios";
import { connectSocket } from "@/lib/socket";
import { setUser } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      const res = await api.post("/auth/signin", data);
      console.log("LOGIN RES:", res.data);
const raw = res.data.data;
const user = raw.user ?? raw;
console.log("USER ROLE:", user.role);
console.log("REDIRECTING TO:", user.role === "USER" ? "/dashboard" : "/admin");
      dispatch(setUser(user));
      connectSocket();
      if (user.role === "USER") {
        router.push("/dashboard");
      } else {
        router.push("/admin");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";
      setError(message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1419] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />

      <div className="relative z-10 w-full max-w-md">
        {/* logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#8B5CF6] via-[#06B6D4] to-[#10B981] flex items-center justify-center shadow-lg shadow-[#06B6D4]/20">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
              LiveChat
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F1F5F9] mt-6 mb-1">
            Welcome back
          </h1>
          <p className="text-[#94A3B8] text-sm">Sign in to your account</p>
        </div>

        <div className="bg-[#1E2530] border border-[#334155] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div>
              <label className="text-sm font-medium text-[#F1F5F9] block mb-1.5">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#0F1419] border border-[#334155] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#06B6D4] transition-colors"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[#F1F5F9]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#06B6D4] hover:text-[#22D3EE] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0F1419] border border-[#334155] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#06B6D4] transition-colors"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/20 text-md mt-1"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#06B6D4] hover:text-[#22D3EE] font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
