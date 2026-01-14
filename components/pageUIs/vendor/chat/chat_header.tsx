import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  name?: string;
  avatar?: string;
  status?: string;
  onViewOrderDetails?: () => void;
  onBack?: () => void;
}

export const ChatHeader = ({
  name = "Michael Ndegwa",
  avatar,
  status = "Ongoing order",
  onViewOrderDetails,
  onBack,
}: ChatHeaderProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        {/* Back button - only visible on mobile */}
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
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
        onClick={onViewOrderDetails}
        className="border-border text-foreground hover:bg-accent bg-transparent hidden sm:flex"
      >
        View Order Details
      </Button>
    </div>
  );
};
