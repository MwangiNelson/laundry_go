import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ILaundryOrderData, LaundryOrderStatus } from "./laundry_orders.data";

// Status badge component with dot indicator matching Figma design
const OrderStatusBadge = ({ status }: { status: LaundryOrderStatus }) => {
  const statusConfig: Record<
    LaundryOrderStatus,
    { label: string; dotColor: string; textColor: string }
  > = {
    ongoing: {
      label: "Ongoing",
      dotColor: "bg-blue-500",
      textColor: "text-blue-500",
    },
    ready: {
      label: "Ready",
      dotColor: "bg-green-500",
      textColor: "text-green-500",
    },
    delivered: {
      label: "Delivered",
      dotColor: "bg-teal-600",
      textColor: "text-teal-600",
    },
    new: {
      label: "New",
      dotColor: "bg-red-600",
      textColor: "text-red-600",
    },
    cancelled: {
      label: "Cancelled",
      dotColor: "bg-gray-400",
      textColor: "text-gray-400",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1">
      <span className={cn("size-2 rounded-full", config.dotColor)} />
      <span className={cn("text-sm font-medium", config.textColor)}>
        {config.label}
      </span>
    </div>
  );
};

// ALL columns for Laundry Orders table
export const laundryOrdersColumns: ColumnDef<ILaundryOrderData>[] = [
  {
    id: "customer",
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => {
      const { customerName, customerAvatar } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border-2 border-orange-400">
            <AvatarImage src={customerAvatar} alt={customerName} />
            <AvatarFallback>
              {customerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">
            {customerName}
          </span>
        </div>
      );
    },
  },
  {
    id: "orderItems",
    header: "Order Items",
    accessorKey: "orderItems",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">
          {row.original.orderItems}
        </span>
      );
    },
  },
  {
    id: "service",
    header: "Service",
    accessorKey: "service",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">{row.original.service}</span>
      );
    },
  },
  {
    id: "amount",
    header: "Amount (kes)",
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-foreground">
          {row.original.amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "pickupDate",
    header: "Pick up Date",
    accessorKey: "pickupDate",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">
          {row.original.pickupDate}
        </span>
      );
    },
  },
  {
    id: "location",
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">{row.original.location}</span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return <OrderStatusBadge status={row.original.status} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => console.log("View order:", row.original.id)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit order:", row.original.id)}
            >
              Edit Order
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Cancel order:", row.original.id)}
              className="text-destructive"
            >
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
