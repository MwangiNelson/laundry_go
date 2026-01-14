"use client";
import React, { useState } from "react";
import { ChatConversations } from "./chat_conversations";
import { ChatMainContainer } from "./chat_main_container";
import { cn } from "@/lib/utils";

export const ChatPageUI = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="font-semibold text-2xl">Chat</h1>
      <div className="flex w-full gap-4">
        {/* Conversations list - hidden on mobile when chat is open */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 flex-shrink-0",
            selectedConversationId && "hidden md:block"
          )}
        >
          <ChatConversations onConversationSelect={handleConversationSelect} />
        </div>

        {/* Chat container - hidden on mobile when no conversation selected */}
        <div
          className={cn("flex-1", !selectedConversationId && "hidden md:flex")}
        >
          <ChatMainContainer
            selectedConversationId={selectedConversationId}
            onBack={handleBackToConversations}
          />
        </div>
      </div>
    </div>
  );
};
