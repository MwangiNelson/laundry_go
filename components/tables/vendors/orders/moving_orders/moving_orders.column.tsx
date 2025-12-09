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
import { IMovingOrderData, MovingOrderStatus } from "./moving_orders.data";

// Status badge component with dot indicator matching Figma design
const OrderStatusBadge = ({ status }: { status: MovingOrderStatus }) => {
  const statusConfig: Record<
    MovingOrderStatus,
    { label: string; dotColor: string; textColor: string }
  > = {
    ongoing: {
      label: "Ongoing",
      dotColor: "bg-blue-500",
      textColor: "text-blue-500",
    },
    in_transit: {
      label: "In Transit",
      dotColor: "bg-green-600",
      textColor: "text-green-600",
    },
    complete: {
      label: "Complete",
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
    scheduled: {
      label: "Scheduled",
      dotColor: "bg-yellow-600",
      textColor: "text-yellow-600",
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

// ALL columns for Moving Orders table
export const movingOrdersColumns: ColumnDef<IMovingOrderData>[] = [
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
    id: "rooms",
    header: "Rooms",
    accessorKey: "rooms",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">{row.original.rooms}</span>
      );
    },
  },
  {
    id: "movingDate",
    header: "Moving Date",
    accessorKey: "movingDate",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">
          {row.original.movingDate}
        </span>
      );
    },
  },
  {
    id: "movingFrom",
    header: "Moving from",
    accessorKey: "movingFrom",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">
          {row.original.movingFrom}
        </span>
      );
    },
  },
  {
    id: "movingTo",
    header: "Moving to",
    accessorKey: "movingTo",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-foreground">{row.original.movingTo}</span>
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
