"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Menu } from "lucide-react";
import { useChat } from "./chat_provider";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  name: string;
  message: string;
  time: string | null;
  avatar?: string;
  unreadCount?: number;
}

const ChatConversations = () => {
  const { conversations, selectChat } = useChat();
  const handleConversationClick = (id: string) => {
    selectChat(id);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] rounded-md border  bg-card">
      <ConversationHeader onSearch={handleSearch} />
      <div className="flex-1 overflow-y-auto">
        {conversations?.map((conversation) => (
          <ConversationCard
            key={conversation.chat_id}
            conversation={{
              id: conversation.chat_id,
              name: conversation.customer_full_name || "Customer",
              message: conversation.latest_message || "",
              time: conversation.latest_message_time || "",
              avatar: conversation.customer_profile_picture || undefined,
              unreadCount: conversation.unread_count,
            }}
            onClick={() => handleConversationClick(conversation.chat_id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ConversationHeaderProps {
  onSearch?: (query: string) => void;
}

const ConversationHeader = ({ onSearch }: ConversationHeaderProps) => {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-10 border-border focus:border-ring"
          />
        </div>
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};

interface ConversationCardProps {
  conversation: Conversation;
  onClick?: () => void;
}

const ConversationCard = ({ conversation, onClick }: ConversationCardProps) => {
  const initials = conversation.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formattedTime = conversation.time
    ? formatDistanceToNow(new Date(conversation.time), { addSuffix: true })
    : "";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0 text-left"
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={conversation.avatar} alt={conversation.name} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-title truncate">
            {conversation.name}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formattedTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {conversation.message}
        </p>
      </div>

      {conversation.unreadCount && conversation.unreadCount > 0 && (
        <Badge
          variant="default"
          className="bg-primary text-primary-foreground h-5 min-w-5 rounded-full flex items-center justify-center text-xs px-1.5"
        >
          {conversation.unreadCount}
        </Badge>
      )}
    </button>
  );
};

export { ChatConversations, ConversationHeader, ConversationCard };
export type { Conversation };
