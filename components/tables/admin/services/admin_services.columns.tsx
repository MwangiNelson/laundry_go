"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MainServicesModal } from "@/components/modals/admin/services/main_services.modal";

export interface IService {
  id: string;
  name: string;
  total_vendors: number;
  no_of_order_items: number;
  ongoing_orders: number;
}

export const servicesColumns: ColumnDef<IService>[] = [
  {
    id: "service_name",
    header: "Service",
    accessorKey: "name",
    cell: ({ row }) => {
      const { name } = row.original;
      return (
        <div className="flex items-center gap-3">
          <span className="font-medium text-title text-sm">
            {name || "Unnamed Service"}
          </span>
        </div>
      );
    },
  },
  {
    id: "total_vendors",
    header: "Total Vendors",
    accessorKey: "total_vendors",
    cell: ({ row }) => {
      const { total_vendors } = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-title">
            {total_vendors || 0}
          </span>
        </div>
      );
    },
  },
  {
    id: "no_of_order_items",
    header: "No. of order items",
    accessorKey: "no_of_order_items",
    cell: ({ row }) => {
      const { no_of_order_items } = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-title font-medium">
            {no_of_order_items || 0}
          </span>
        </div>
      );
    },
  },
  {
    id: "ongoing_orders",
    header: "Ongoing orders",
    accessorKey: "ongoing_orders",
    cell: ({ row }) => {
      const { ongoing_orders } = row.original;
      return <span className="text-xs font-medium">{ongoing_orders || 0}</span>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <MainServicesModal
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Edit Service
                  </DropdownMenuItem>
                }
              />

              <DropdownMenuItem className="text-destructive">
                Delete Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
