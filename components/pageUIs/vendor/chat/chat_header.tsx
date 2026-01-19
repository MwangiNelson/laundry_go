"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useChat } from "./chat_provider";

export const ChatHeader = () => {
  const { selectedConversation, clearSelection } = useChat();

  if (!selectedConversation) {
    return null;
  }

  const name = selectedConversation.customer_full_name || "Customer";
  const avatar = selectedConversation.customer_profile_picture || undefined;
  const status = "Ongoing order";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleViewOrderDetails = () => {
    console.log("View order details clicked");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        {/* Back button - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={clearSelection}
          className="md:hidden shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-base font-semibold text-title">{name}</h3>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">{status}</span>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={handleViewOrderDetails}
        className="border-border text-foreground hover:bg-accent bg-transparent hidden sm:flex"
      >
        View Order Details
      </Button>
    </div>
  );
};
