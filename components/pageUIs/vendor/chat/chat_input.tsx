import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
}

export const ChatInput = ({
  onSendMessage,
  placeholder = "Enter message...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-border bg-card">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 bg-background border-border focus:border-ring"
      />
      <Button
        onClick={handleSend}
        size="icon"
        variant="outline"
        className="h-10 w-10 border-border hover:bg-accent"
      >
        <Send className="h-4 w-4 text-foreground" />
      </Button>
    </div>
  );
};
