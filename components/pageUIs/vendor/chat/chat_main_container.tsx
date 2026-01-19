"use client";
import React from "react";
import { ChatHeader } from "./chat_header";
import { ChatMessagesContainer } from "./chat_messages_container";
import { ChatInput } from "./chat_input";

import { useChat } from "./chat_provider";

export const ChatMainContainer = () => {
  const { selectedChatId } = useChat();

  // Show empty state when no conversation is selected
  if (!selectedChatId) {
    return (
      <div className="flex flex-col items-center justify-center bg-card border border-border rounded-lg overflow-hidden flex-1 h-[calc(100vh-20rem)]">
        <p className="text-muted-foreground text-sm">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden flex-1 h-[calc(100vh-20rem)]">
      <ChatHeader />
      <ChatMessagesContainer />
      <ChatInput />
    </div>
  );
};
