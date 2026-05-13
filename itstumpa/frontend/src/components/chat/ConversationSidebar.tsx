"use client";

import { useEffect, useState } from "react";
import NewChatModal from "./NewChatModal";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setConversations, setConversationsLoading } from "@/store/slices/conversationsSlice";
import { clearUser } from "@/store/slices/authSlice";
import { disconnectSocket } from "@/lib/socket";
import type { Conversation } from "@/types";

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ConversationSidebar({ onSelect }: { onSelect?: () => void }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const activeId = params?.conversationId as string | undefined;
  const { user } = useAppSelector((s) => s.auth);
  const { conversations, isLoading } = useAppSelector((s) => s.conversations);
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      dispatch(setConversationsLoading(true));
      try {
        const res = await api.get("/chat/conversations");
        dispatch(setConversations(res.data.data));
      } finally {
        dispatch(setConversationsLoading(false));
      }
    };
    fetchConversations();
  }, [dispatch]);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    disconnectSocket();
    dispatch(clearUser());
    router.push("/login");
  };

const filtered = conversations.filter((c: Conversation) =>
  c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <aside className="flex flex-col h-full bg-[#1E2530] border-r border-[#334155]">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-[#334155]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#1E2530]" />
            </div>
            <div className="min-w-0">
              <p className="text-[#F1F5F9] font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-[#10B981] text-xs">● Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#94A3B8] hover:text-red-400 transition-colors text-xs px-2 py-1 rounded-lg hover:bg-red-400/10"
          >
            Logout
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0F1419] border border-[#334155] rounded-xl px-4 py-2.5 text-[#F1F5F9] text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#06B6D4] transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
  <button
    onClick={() => setShowNewChat(true)}
    className="text-[#94A3B8] hover:text-[#06B6D4] transition-colors text-xs px-2 py-1 rounded-lg hover:bg-[#06B6D4]/10"
  >
    + New
  </button>
  <button
    onClick={handleLogout}
    className="text-[#94A3B8] hover:text-red-400 transition-colors text-xs px-2 py-1 rounded-lg hover:bg-red-400/10"
  >
    Logout
  </button>
</div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <p className="text-[#94A3B8] text-sm">No conversations yet</p>
          </div>
        ) : (
          filtered.map((conv: Conversation) => (
            <button
              key={conv.id}
              onClick={() => {
                router.push(`/dashboard/chat/${conv.id}`);
                onSelect?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#0F1419]/50 transition-colors border-b border-[#334155]/50 text-left ${
                activeId === conv.id ? "bg-[#0F1419]/70 border-l-2 border-l-[#06B6D4]" : ""
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm">
                  {conv.otherUser?.name[0].toUpperCase()}
                </div>
                {conv.otherUser?.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#1E2530]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[#F1F5F9] text-sm font-medium truncate">{conv.otherUser?.name}</p>
                  {conv.lastMessage && (
                    <span className="text-[#94A3B8] text-xs shrink-0 ml-2">
                      {formatTime(conv.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[#94A3B8] text-xs truncate max-w-[160px]">
                    {conv.lastMessage?.content ?? (conv.lastMessage?.fileUrl ? "📎 File" : "No messages yet")}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="bg-[#06B6D4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-1">
                      {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
    </aside>
  );
}