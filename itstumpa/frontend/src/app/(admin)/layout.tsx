"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { connectSocket } from "@/lib/socket";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        const user = res.data.data.user;
        if (user.role === "USER") {
          router.replace("/dashboard");
          return;
        }
        dispatch(setUser(user));
        connectSocket();
      } catch {
        dispatch(clearUser());
        router.replace("/login");
      }
    };
    checkAuth();
  }, [dispatch, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}