"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/context/auth_provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export const VendorOnboardingNavbar = () => {
  const { user, logout } = useAuth();
  const userName = user?.full_name || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header className="border-b border-border bg-landing-primary">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/logos/main.svg"
            alt="LaundryGo!"
            width={202}
            height={47}
            className="h-auto w-[140px]"
            priority
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-white/10">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url || "/"} alt={userName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-white sm:inline">
              {userName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="min-w-48 rounded-xl border bg-card p-2 shadow-lg"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{userName}</p>
              {user?.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem
              className="rounded-md px-3 py-2 text-sm"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
