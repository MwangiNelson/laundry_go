"use client";
import React from "react";
import { ChatConversations } from "./chat_conversations";
import { ChatMainContainer } from "./chat_main_container";

export const ChatPageUI = () => {
  return (
    <div className="p-4">
      <h1 className="font-semibold text-2xl">Chat</h1>
      <div className="flex w-full gap-4">
        <ChatConversations />
        <ChatMainContainer />
      </div>
    </div>
  );
};
