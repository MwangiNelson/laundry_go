"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export interface ICustomer {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  location: string;
  orders_placed: number;
  ongoing_orders: number;
  joined_at: string;
  status: "active" | "inactive";
}

export const customersColumns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: "full_name",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      const initials =
        customer.full_name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || customer.email[0].toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={customer.avatar_url || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {customer.full_name || "No Name"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "orders_placed",
    header: "Orders Placed",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.orders_placed}</span>
    ),
  },
  {
    accessorKey: "ongoing_orders",
    header: "Ongoing Orders",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.ongoing_orders}</span>;
    },
  },
  {
    accessorKey: "joined_at",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.original.joined_at);
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>View Orders</DropdownMenuItem>
            {customer.status === "active" ? (
              <DropdownMenuItem className="text-destructive">
                Suspend Account
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>Activate Account</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
