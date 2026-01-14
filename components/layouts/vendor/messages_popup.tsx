"use client";
import React, { useState } from "react";
import { Package, Truck, Bed, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatCenteredDotsIcon } from "@phosphor-icons/react";
interface Notification {
  id: string;
  type: "laundry" | "moving" | "fumigation" | "completed" | "update";
  title: string;
  description: string;
  details: string;
  time: string;
  isRead: boolean;
}

// Dummy notifications
const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "laundry",
    title: "New Laundry Order",
    description: "Express · Applewood Adams",
    details: "3 items",
    time: "Just now",
    isRead: false,
  },
  {
    id: "2",
    type: "laundry",
    title: "New Laundry Order",
    description: "Scheduled · Applewood Adams",
    details: "12 items",
    time: "5 min ago",
    isRead: false,
  },
  {
    id: "3",
    type: "moving",
    title: "New Moving Order",
    description: "Applewood Adams",
    details: "12 rooms",
    time: "5 min ago",
    isRead: false,
  },
  {
    id: "4",
    type: "fumigation",
    title: "New Fumigation Order",
    description: "Applewood Adams",
    details: "12 rooms",
    time: "5 min ago",
    isRead: false,
  },
  {
    id: "5",
    type: "completed",
    title: "Laundry Order Completed",
    description: "Applewood Adams",
    details: "12 items",
    time: "5 min ago",
    isRead: false,
  },
  {
    id: "6",
    type: "update",
    title: "Beddings Added Under Laundry",
    description: "You can now include this in your catalog",
    details: "",
    time: "5 min ago",
    isRead: false,
  },
];

type FilterType = "all" | "unread" | "read";

export const MessagesPopup = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [notifications, setNotifications] = useState(dummyNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "unread") return !notification.isRead;
    if (activeFilter === "read") return notification.isRead;
    return true;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChatCenteredDotsIcon className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Notifications
          </h2>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Mark all as read
          </button>
        </div>
        <div className="flex gap-6 px-4 pt-4 border-b border-border">
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeFilter === "all"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
            {activeFilter === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeFilter === "unread"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread
            {activeFilter === "unread" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveFilter("read")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activeFilter === "read"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Read
            {activeFilter === "read" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <MessageCard key={notification.id} {...notification} />
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface MessageCardProps {
  type: "laundry" | "moving" | "fumigation" | "completed" | "update";
  title: string;
  description: string;
  details: string;
  time: string;
  isRead: boolean;
}
const MessageCard = ({
  type,
  title,
  description,
  details,
  time,
  isRead,
}: MessageCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "laundry":
        return <Package className="h-5 w-5 text-muted-foreground" />;
      case "moving":
        return <Truck className="h-5 w-5 text-muted-foreground" />;
      case "fumigation":
        return <Sparkles className="h-5 w-5 text-muted-foreground" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "update":
        return <Bed className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors cursor-pointer",
        !isRead && "bg-accent/20"
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 p-2 rounded-full bg-muted/50">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
          {details && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {details}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{description}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  );
};
