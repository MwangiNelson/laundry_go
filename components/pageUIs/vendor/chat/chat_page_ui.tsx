"use client";
import React from "react";
import { ChatConversations } from "./chat_conversations";
import { ChatMainContainer } from "./chat_main_container";
import { ChatProvider } from "./chat_provider";
import { cn } from "@/lib/utils";

export const ChatPageUI = () => {
  return (
    <ChatProvider>
      <div className="p-4 space-y-6">
        <h1 className="font-semibold text-2xl">Chat</h1>
        <div className="flex w-full gap-4">
          {/* Conversations list - hidden on mobile when chat is open */}
          <div className={cn("w-full md:w-80 lg:w-96 shrink-0")}>
            <ChatConversations />
          </div>

          {/* Chat container */}
          <div className={cn("flex-1")}>
            <ChatMainContainer />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};
