import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IRecentOrderData, OrderStatus } from "./recent_orders.data";

// Status badge component with dot indicator matching Figma design
const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig: Record<
    OrderStatus,
    { label: string; dotColor: string; textColor: string }
  > = {
    new: {
      label: "New",
      dotColor: "bg-[#b28b00]",
      textColor: "text-[#b28b00]",
    },
    "in-progress": {
      label: "In Progress",
      dotColor: "bg-[#8a8cd9]",
      textColor: "text-[#8a8cd9]",
    },
    ready: {
      label: "Ready",
      dotColor: "bg-[#4aa785]",
      textColor: "text-[#4aa785]",
    },
    delivered: {
      label: "Delivered",
      dotColor: "bg-[#59a8d4]",
      textColor: "text-[#59a8d4]",
    },
    cancelled: {
      label: "Cancelled",
      dotColor: "bg-black/40",
      textColor: "text-black/40",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1">
      <span className={cn("size-2 rounded-full", config.dotColor)} />
      <span className={cn("text-base", config.textColor)}>{config.label}</span>
    </div>
  );
};

// ALL columns for Recent Orders table
export const recentOrdersColumns: ColumnDef<IRecentOrderData>[] = [
  {
    id: "orderId",
    header: "Order ID",
    accessorKey: "orderId",
    cell: ({ row }) => {
      return <span className="text-title">{row.original.orderId}</span>;
    },
  },
  {
    id: "customer",
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => {
      const { customerName, customerAvatar } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6 border border-[#ff8a65]">
            <AvatarImage src={customerAvatar} alt={customerName} />
            <AvatarFallback>
              {customerName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-title">{customerName}</span>
        </div>
      );
    },
  },
  {
    id: "service",
    header: "Service",
    accessorKey: "service",
    cell: ({ row }) => {
      return <span className="text-title">{row.original.service}</span>;
    },
  },
  {
    id: "price",
    header: "Price (kes)",
    accessorKey: "price",
    cell: ({ row }) => {
      return (
        <span className="text-title">
          {row.original.price.toLocaleString()}
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
];
