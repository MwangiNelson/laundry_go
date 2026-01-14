import React from "react";
import { ChatHeader } from "./chat_header";
import { ChatMessagesContainer } from "./chat_messages_container";
import { ChatInput } from "./chat_input";

interface ChatMainContainerProps {
  selectedConversationId?: string | null;
  onBack?: () => void;
}

export const ChatMainContainer = ({
  selectedConversationId,
  onBack,
}: ChatMainContainerProps) => {
  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
  };

  const handleViewOrderDetails = () => {
    console.log("View order details clicked");
  };

  // Show empty state when no conversation is selected
  if (!selectedConversationId) {
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
      <ChatHeader onViewOrderDetails={handleViewOrderDetails} onBack={onBack} />
      <ChatMessagesContainer />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
