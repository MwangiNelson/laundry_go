"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useCreateConversation } from "@/api/vendor/chat/use_conversations";
import {
  useMessages,
  useMarkMessagesAsRead,
  useSendMessage,
} from "@/api/vendor/chat/use_messages";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { Database } from "@/database.types";

type ConversationSummary =
  Database["public"]["Functions"]["get_vendor_chats_with_details"]["Returns"][0];
type UIMessage = {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
};

type ChatContextValue = {
  conversations: ConversationSummary[] | undefined;
  conversationsLoading: boolean;
  conversationsError: unknown;
  selectedChatId: string | null;
  selectChat: (chatId: string) => void;
  selectedConversation: ConversationSummary | undefined;
  messages: UIMessage[] | undefined;
  messagesLoading: boolean;
  messagesError: unknown;
  clearSelection: () => void;
  sendMessage: (content: string) => void;
  isSendingMessage: boolean;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useCreateConversation();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { vendor } = useVendor();

  const selectedConversation = useMemo(() => {
    if (!conversations || !selectedChatId) return undefined;
    return conversations.find((c) => c.chat_id === selectedChatId);
  }, [conversations, selectedChatId]);

  const {
    data: rawMessages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useMessages(selectedChatId ?? undefined);

  const { mutateAsync: markAsRead } = useMarkMessagesAsRead();
  const { mutate: sendMsg, isPending: isSendingMessage } = useSendMessage();

  // Auto-mark messages as read when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      const markRead = async () => {
        try {
          await markAsRead(selectedChatId);
        } catch (error) {
          console.error("Failed to mark messages as read:", error);
        }
      };
      markRead();
    }
  }, [selectedChatId, markAsRead]);

  const messages: UIMessage[] | undefined = useMemo(() => {
    if (!rawMessages) return undefined;
    return rawMessages.map((m) => ({
      id: m.id,
      text: m.content,
      time: m.created_at ?? "",
      isOwn: vendor ? m.sender_id === vendor.admin_id : false,
    }));
  }, [rawMessages, vendor]);

  const handleSendMessage = (content: string) => {
    if (!selectedChatId || !vendor?.admin_id) return;
    sendMsg({
      chatId: selectedChatId,
      senderId: vendor.admin_id,
      content,
    });
  };

  const value: ChatContextValue = {
    conversations: conversations as ConversationSummary[] | undefined,
    conversationsLoading,
    conversationsError,
    selectedChatId,
    selectChat: (chatId: string) => setSelectedChatId(chatId),
    selectedConversation,
    messages,
    messagesLoading,
    messagesError,
    clearSelection: () => setSelectedChatId(null),
    sendMessage: handleSendMessage,
    isSendingMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
