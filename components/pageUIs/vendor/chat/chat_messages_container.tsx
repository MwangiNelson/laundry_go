"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useChat } from "./chat_provider";
import { formatDistanceToNow } from "date-fns";
interface Message {
  id: string;
  text: string;
  time: string | null;
  isOwn: boolean;
}

export const ChatMessagesContainer = () => {
  const { messages = [] } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-background">
      <div className="flex flex-col gap-4">
        {/* Date divider */}
        <div className="flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Today</span>
        </div>

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const formattedTime = message.time
    ? formatDistanceToNow(new Date(message.time), { addSuffix: true })
    : "";

  return (
    <div
      className={cn(
        "flex flex-col max-w-[70%]",
        message.isOwn ? "self-end items-end" : "self-start items-start"
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-2",
          message.isOwn
            ? "bg-primary-blue text-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      <span className="text-xs text-muted-foreground mt-1">
        {formattedTime}
      </span>
    </div>
  );
};

export type { Message };
