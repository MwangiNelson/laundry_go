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
import { EditMainServicesModal } from "@/components/modals/admin/services/edit_main_services.modal";
import { Database } from "@/database.types";

export const servicesColumns: ColumnDef<
  Database["public"]["Functions"]["get_service_analytics"]["Returns"][0]
>[] = [
  {
    accessorKey: "service_name",
    header: "Service Name",
    cell: ({ row }) => {
      return <span>{row.original.service_name}</span>;
    },
  },
  {
    accessorKey: "total_vendors",
    header: "Total Vendors",
    cell: ({ row }) => {
      return <span>{row.original.total_vendors}</span>;
    },
  },
  {
    accessorKey: "number_of_service_items",
    header: "Service Items",
    cell: ({ row }) => {
      return <span>{row.original.number_of_service_items}</span>;
    },
  },
  {
    accessorKey: "no_of_orders",
    header: "No. of Orders",
    cell: ({ row }) => {
      return <span>{row.original.no_of_orders}</span>;
    },
  },
  {
    accessorKey: "ongoing_orders",
    header: "Ongoing Orders",
    cell: ({ row }) => {
      return <span>{row.original.ongoing_orders}</span>;
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
              <EditMainServicesModal
                service_id={row.original.id}
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
