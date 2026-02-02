import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// ALL columns for Recent Orders table
export const recentOrdersColumns: ColumnDef<IOrder>[] = [
  {
    id: "orderId",
    header: "Order ID",
    accessorKey: "id",
    cell: ({ row }) => {
      const orderId = row.original.id.slice(0, 8).toUpperCase();
      return <span className="text-title">#{orderId}</span>;
    },
  },
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
          .toUpperCase()
          .slice(0, 2) || "NA";

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={customerAvatar || ""} alt={customerName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-title">{customerName}</span>
        </div>
      );
    },
  },
  {
    id: "service",
    header: "Service",
    accessorKey: "main_service.service",
    cell: ({ row }) => {
      const service = row.original.main_service?.service || "Unknown";
      return <span className="text-title capitalize">{service}</span>;
    },
  },
  {
    id: "price",
    header: "Price (KES)",
    accessorKey: "total_price",
    cell: ({ row }) => {
      return (
        <span className="text-title">
          {row.original.total_price.toLocaleString()}
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
