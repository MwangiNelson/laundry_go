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

// Status badge component with dot indicator matching Figma design
const OrderStatusBadge = ({
  status,
}: {
  status: string | null | undefined;
}) => {
  if (!status) {
    return <span className="text-sm text-muted-foreground">Unknown</span>;
  }

  const statusConfig: Record<
    string,
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
    in_pickup: {
      label: "In Pickup",
      dotColor: "bg-purple-500",
      textColor: "text-purple-500",
    },
    in_processing: {
      label: "In Processing",
      dotColor: "bg-indigo-500",
      textColor: "text-indigo-500",
    },
    ready_for_delivery: {
      label: "Ready for Delivery",
      dotColor: "bg-green-500",
      textColor: "text-green-500",
    },
    under_delivery: {
      label: "Under Delivery",
      dotColor: "bg-cyan-500",
      textColor: "text-cyan-500",
    },
    complete: {
      label: "Complete",
      dotColor: "bg-teal-600",
      textColor: "text-teal-600",
    },
    cancelled: {
      label: "Cancelled",
      dotColor: "bg-gray-400",
      textColor: "text-gray-400",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    dotColor: "bg-gray-300",
    textColor: "text-gray-600",
  };

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
export const laundryOrdersColumns: ColumnDef<IOrder>[] = [
  {
    id: "customer",
    header: "Customer",
    accessorKey: "customer.full_name",
    cell: ({ row }) => {
      const customer = row.original.customer;
      if (!customer) {
        return <span className="text-sm text-muted-foreground">Unknown</span>;
      }
      const customerName = customer.full_name || customer.email || "No Name";
      const customerAvatar = customer.avatar_url;
      const initials =
        customerName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "?";
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8 border-2 border-orange-400">
            <AvatarImage src={customerAvatar || ""} alt={customerName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">
            {customerName}
          </span>
        </div>
      );
    },
  },
  {
    id: "order_item",
    header: "Services",
    cell: ({ row }) => {
      const serviceOptions = row.original.order_items.length;
      return <span className="text-sm text-foreground">{serviceOptions}</span>;
    },
  },
  {
    id: "orderItems",
    header: "Order Items",
    cell: ({ row }) => {
      if (!row.original.order_items || row.original.order_items.length === 0) {
        return <span className="text-sm text-muted-foreground">No items</span>;
      }
      const itemNames =
        row.original.order_items
          .filter((item) => item?.service_item?.name)
          .map((item) => item.service_item.name)
          .join(", ") || "No items";
      return <span className="text-sm text-foreground">{itemNames}</span>;
    },
  },

  {
    id: "amount",
    header: "Amount (kes)",
    accessorKey: "total_price",
    cell: ({ row }) => {
      const amount = row.original.total_price;
      if (amount === null || amount === undefined || isNaN(amount)) {
        return <span className="text-sm text-muted-foreground">N/A</span>;
      }
      return (
        <span className="text-sm font-medium text-foreground">
          {amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "pickupDate",
    header: "Pick up Date",
    accessorKey: "created_at",
    cell: ({ row }) => {
      if (!row.original.created_at) {
        return <span className="text-sm text-muted-foreground">N/A</span>;
      }
      try {
        const date = new Date(row.original.created_at).toLocaleDateString();
        return <span className="text-sm text-foreground">{date}</span>;
      } catch {
        return (
          <span className="text-sm text-muted-foreground">Invalid date</span>
        );
      }
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
