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
import { IOrder } from "@/api/vendor/order/use_fetch_orders";
import { FumigationOrderStatus } from "./fumigation_orders.data";

// Status badge component with dot indicator matching Figma design
const OrderStatusBadge = ({ status }: { status: FumigationOrderStatus }) => {
  const statusConfig: Record<
    FumigationOrderStatus,
    { label: string; dotColor: string; textColor: string }
  > = {
    under_review: {
      label: "Under Review",
      dotColor: "bg-yellow-500",
      textColor: "text-yellow-500",
    },
    accepted: {
      label: "Accepted",
      dotColor: "bg-blue-500",
      textColor: "text-blue-500",
    },
    in_processing: {
      label: "In Processing",
      dotColor: "bg-purple-500",
      textColor: "text-purple-500",
    },
    complete: {
      label: "Complete",
      dotColor: "bg-green-500",
      textColor: "text-green-500",
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

// ALL columns for Fumigation Orders table
export const fumigationOrdersColumns: ColumnDef<IOrder>[] = [
  {
    id: "customer",
    header: "Customer",
    accessorKey: "customer.full_name",
    cell: ({ row }) => {
      const customerName =
        row.original.customer.full_name || row.original.customer.email;
      const customerAvatar = row.original.customer.avatar_url;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border-2 border-orange-400">
            <AvatarImage src={customerAvatar || ""} alt={customerName} />
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
    cell: ({ row }) => {
      const itemNames = row.original.order_items
        .map((item) => item.service_item.name)
        .join(", ");
      return <span className="text-sm text-foreground">{itemNames}</span>;
    },
  },
  {
    id: "service",
    header: "Service",
    cell: ({ row }) => {
      const serviceOptions = row.original.order_items
        .map((item) => item.service_option?.name)
        .filter(Boolean)
        .join(", ");
      return <span className="text-sm text-foreground">{serviceOptions}</span>;
    },
  },
  {
    id: "amount",
    header: "Amount (kes)",
    accessorKey: "total_price",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-foreground">
          {row.original.total_price.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "pickupDate",
    header: "Pick up Date",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at).toLocaleDateString();
      return <span className="text-sm text-foreground">{date}</span>;
    },
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const location =
        row.original.pickup_details?.location ||
        row.original.delivery_details?.location ||
        "N/A";
      return <span className="text-sm text-foreground">{location}</span>;
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status as FumigationOrderStatus;
      return <OrderStatusBadge status={status} />;
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
