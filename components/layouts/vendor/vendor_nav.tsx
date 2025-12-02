import React from "react";
import { Bell, ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../context/auth_provider";
import { PanelLeft } from "lucide-react";
import { SquaresFourIcon, BellIcon } from "@phosphor-icons/react";
import { useVendorUI } from "./vendor_ui_provider";
export const VendorNavbar = () => {
  const { sidebar } = useVendorUI();
  const isCollapsed = !sidebar.isOpen;

  return (
    <header className=" text-foreground flex h-20 w-full items-center px-4 border-b border-border bg-background ">
      <button
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => sidebar.setIsOpen((v) => !v)}
        className="text-foreground/80 -ml-2 hover:text-foreground mr-2 inline-flex h-6 w-6 items-center justify-center"
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <PanelLeft className="h-5 w-5" />
        )}
      </button>

      <div className="flex items-center gap-2 border-l border-foreground/50 pl-2">
        <span className="text-lg  leading-none">Overview</span>
      </div>
      <UserDropdown />
    </header>
  );
};

//
const UserDropdown = () => {
  const { user, logout } = useAuth();
  const userName = user?.full_name || "User";
  const userEmail = user?.email || "";

  return (
    <div className="ml-auto flex items-center gap-3">
      <BellIcon className="h-5 w-5" />
      <DropdownMenu>
        <DropdownMenuTrigger className="text-foreground/90 hover:text-foreground inline-flex items-center gap-2  px-2 py-1  bg-background">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url || "/"} alt={userName} />
            <AvatarFallback className="">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium">{userName}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-56 rounded-2xl border bg-card p-2 shadow-lg"
        >
          <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mx-2" />
          <DropdownMenuItem className="rounded-md px-3 py-2 text-sm">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md px-3 py-2 text-sm">
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="mx-2" />
          <DropdownMenuItem
            className="rounded-md px-3 py-2 text-sm"
            onClick={logout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
