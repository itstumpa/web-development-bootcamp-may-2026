"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface SearchUser {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
}

interface SearchResponse {
  data: SearchUser[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export default function NewChatModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [isStarting, setIsStarting] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const limit = 10;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // reset on query change
  useEffect(() => {
    setUsers([]);
    setPage(1);
  }, [query]);

  // debounced search
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setHasMore(false);
      return;
    }

    const timeout = setTimeout(() => {
      fetchUsers(1, true);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const fetchUsers = async (pageNum: number, reset = false) => {
    if (!query.trim()) return;

    // cancel previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    try {
      const res = await api.get<SearchResponse>("/users/search", {
        params: {
          q: query,
          page: pageNum,
          limit,
        },
        signal: controller.signal,
      });

      const list = res.data.data ?? [];
      const total = res.data.meta?.total ?? list.length;

      setUsers((prev) => (reset ? list : [...prev, ...list]));
      setHasMore(pageNum * limit < total);
      setPage(pageNum);
    } catch (err) {
      // ignore abort errors
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    fetchUsers(page + 1);
  };

  const handleStart = async (userId: string) => {
    if (!userId) return;

    setIsStarting(userId);

    try {
      const res = await api.post("/chat/conversations", {
        otherUserId: userId,
      });

      const conv = res.data.data;

      router.push(`/dashboard/chat/${conv.id}`);
      onClose();
    } finally {
      setIsStarting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-[#1E2530] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#334155]">
          <h2 className="text-[#F1F5F9] font-semibold text-sm">
            New Conversation
          </h2>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F1F5F9]"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-[#334155]">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#0F1419] border border-[#334155] rounded-xl px-4 py-2.5 text-[#F1F5F9] text-sm"
          />
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!query.trim() && (
            <p className="text-center text-[#94A3B8] py-10 text-sm">
              Type to search users
            </p>
          )}

          {query.trim() && isLoading && users.length === 0 && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#06B6D4] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {query.trim() && !isLoading && users.length === 0 && (
            <p className="text-center text-[#94A3B8] py-10 text-sm">
              No users found
            </p>
          )}

          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#0F1419]/50"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
                {u.name?.[0]?.toUpperCase() ?? "?"}
              </div>

              <div className="flex-1">
                <p className="text-[#F1F5F9] text-sm font-medium truncate">
                  {u.name}
                </p>
                <p className="text-[#94A3B8] text-xs truncate">{u.email}</p>
              </div>

              <button
                onClick={() => handleStart(u.id)}
                disabled={isStarting === u.id}
                className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white disabled:opacity-50"
              >
                {isStarting === u.id ? "..." : "Chat"}
              </button>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center py-3">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="text-xs text-[#06B6D4]"
              >
                {isLoading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}