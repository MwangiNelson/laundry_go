"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat } from "./chat_provider";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isSendingMessage, selectedChatId } = useChat();

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = isSendingMessage ? "Sending..." : "Enter message...";

  return (
    <div className="flex items-center gap-2 p-4 border-t border-border bg-card">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isSendingMessage}
        className="flex-1 bg-background border-border focus:border-ring"
      />
      <Button
        onClick={handleSend}
        size="icon"
        variant="outline"
        loading={isSendingMessage}
        className="h-10 w-10 border-border hover:bg-accent"
      >
        <Send className="h-4 w-4 text-foreground" />
      </Button>
    </div>
  );
};
