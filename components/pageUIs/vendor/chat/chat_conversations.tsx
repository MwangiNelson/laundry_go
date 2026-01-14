"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar?: string;
  unreadCount?: number;
}

// Dummy data
const dummyConversations: Conversation[] = [
  {
    id: "1",
    name: "Michael Ndegwa",
    message: "Yes, I will be available",
    time: "09:43",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Michael Ndegwa",
    message: "Yes, I will be available",
    time: "09:43",
  },
  {
    id: "3",
    name: "Michael Ndegwa",
    message: "Yes, I will be available",
    time: "09:43",
  },
  {
    id: "4",
    name: "Michael Ndegwa",
    message: "Yes, I will be available",
    time: "09:43",
  },
];

interface ChatConversationsProps {
  onConversationSelect?: (id: string) => void;
}

const ChatConversations = ({
  onConversationSelect,
}: ChatConversationsProps) => {
  const handleConversationClick = (id: string) => {
    console.log("Conversation clicked:", id);
    onConversationSelect?.(id);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] rounded-md border  bg-card">
      <ConversationHeader onSearch={handleSearch} />
      <div className="flex-1 overflow-y-auto">
        {dummyConversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            onClick={() => handleConversationClick(conversation.id)}
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

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0 text-left"
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
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
            {conversation.time}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {conversation.message}
        </p>
      </div>

      {conversation.unreadCount && conversation.unreadCount > 0 && (
        <Badge
          variant="default"
          className="bg-primary text-primary-foreground h-5 min-w-[20px] rounded-full flex items-center justify-center text-xs px-1.5"
        >
          {conversation.unreadCount}
        </Badge>
      )}
    </button>
  );
};

export { ChatConversations, ConversationHeader, ConversationCard };
export type { Conversation };
