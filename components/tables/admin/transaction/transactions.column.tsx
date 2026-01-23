"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminTransactionsPageRow } from "@/api/admin/transactions/use_transactions_admin";

export type AdminTransactionRow = AdminTransactionsPageRow;

type NormalizedStatus = "paid" | "pending" | "failed" | "refunded";

const StatusBadge = ({ status }: { status: string | null }) => {
  const normalized = (status || "pending").toLowerCase() as NormalizedStatus;
  const statusConfig: Record<
    NormalizedStatus,
    { label: string; className: string; dot: string }
  > = {
    paid: { label: "Paid", className: "text-green-700", dot: "bg-green-600" },
    pending: {
      label: "Pending",
      className: "text-yellow-700",
      dot: "bg-yellow-500",
    },
    failed: { label: "Failed", className: "text-red-700", dot: "bg-red-600" },
    refunded: {
      label: "Refunded",
      className: "text-slate-600",
      dot: "bg-slate-400",
    },
  };

  const cfg = statusConfig[normalized];
  return (
    <div className={cn("flex items-center gap-2", cfg.className)}>
      <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
      <span className="font-medium">{cfg.label}</span>
    </div>
  );
};

const formatCurrency = (value: unknown) => {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  if (Number.isNaN(n)) return "0";
  return n.toLocaleString("en-KE", { maximumFractionDigits: 0 });
};

const formatDateTime = (iso: string | null) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const transactionsColumns: ColumnDef<AdminTransactionRow>[] = [
  {
    id: "vendor_name",
    header: "Vendor",
    accessorKey: "vendor_name",
    cell: ({ row }) => {
      const { vendor_name } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={""} alt={vendor_name || "Vendor"} />
            <AvatarFallback>
              {(vendor_name || "V").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-title">{vendor_name}</span>
        </div>
      );
    },
  },
  {
    id: "customer_name",
    header: "Customer",
    accessorKey: "customer_name",
    cell: ({ row }) => {
      const { customer_name } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={""} alt={customer_name || "Customer"} />
            <AvatarFallback>
              {(customer_name || "C").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-title">{customer_name}</span>
        </div>
      );
    },
  },
  {
    id: "paid_at",
    header: "Date",
    accessorKey: "paid_at",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{formatDateTime(row.original.paid_at)}</span>
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount (kes)",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="text-title">{formatCurrency(row.original.amount)}</span>
    ),
  },
  {
    id: "commission",
    header: "Commission (kes)",
    accessorKey: "commission",
    cell: ({ row }) => (
      <span className="text-title">
        {formatCurrency(row.original.commission)}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Download receipt</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Mark as refunded
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

