export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  fileUrl?: string;
  fileType?: "image" | "document";
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}