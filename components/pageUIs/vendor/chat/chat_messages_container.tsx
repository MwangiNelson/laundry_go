import React from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
}

interface ChatMessagesContainerProps {
  messages?: Message[];
}

// Dummy messages
const dummyMessages: Message[] = [
  {
    id: "1",
    text: "Hello there,,",
    time: "10:12am",
    isOwn: false,
  },
  {
    id: "2",
    text: "Hello too",
    time: "10:15am",
    isOwn: true,
  },
];

export const ChatMessagesContainer = ({
  messages = dummyMessages,
}: ChatMessagesContainerProps) => {
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
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
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
      <span className="text-xs text-muted-foreground mt-1">{message.time}</span>
    </div>
  );
};

export type { Message };
