import React from "react";
import { ChatHeader } from "./chat_header";
import { ChatMessagesContainer } from "./chat_messages_container";
import { ChatInput } from "./chat_input";

export const ChatMainContainer = () => {
  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
  };

  const handleViewOrderDetails = () => {
    console.log("View order details clicked");
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden flex-1 ">
      <ChatHeader onViewOrderDetails={handleViewOrderDetails} />
      <ChatMessagesContainer />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
