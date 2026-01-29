import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export interface IVendorOrder {
  id: string;
  customer_name: string;
  service: string;
  order_items: string;
  payment_status: "Paid" | "Unpaid";
  date_placed: string;
  status: "pending" | "completed" | "cancelled";
}

// Status badge component
const OrderStatusBadge = ({ status }: { status: IVendorOrder["status"] }) => {
  const statusConfig: Record<
    IVendorOrder["status"],
    { label: string; dotColor: string; textColor: string }
  > = {
    pending: {
      label: "Pending",
      dotColor: "bg-yellow-600",
      textColor: "text-yellow-600",
    },
    completed: {
      label: "Completed",
      dotColor: "bg-green-600",
      textColor: "text-green-600",
    },
    cancelled: {
      label: "Cancelled",
      dotColor: "bg-red-600",
      textColor: "text-red-600",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", config.dotColor)} />
      <span className={cn("text-sm font-medium", config.textColor)}>
        {config.label}
      </span>
    </div>
  );
};

export const vendorOrdersColumns: ColumnDef<IVendorOrder>[] = [
  {
    id: "customer",
    header: "Customer",
    accessorKey: "customer_name",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-title">
          {row.original.customer_name}
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
        <span className="text-sm font-medium text-title">
          {row.original.service}
        </span>
      );
    },
  },
  {
    id: "order",
    header: "Order",
    accessorKey: "order_items",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-subtitle">
          {row.original.order_items}
        </span>
      );
    },
  },
  {
    id: "payment",
    header: "Payment",
    accessorKey: "payment_status",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-title">
          {row.original.payment_status}
        </span>
      );
    },
  },
  {
    id: "datePlaced",
    header: "Date Placed",
    accessorKey: "date_placed",
    cell: ({ row }) => {
      const date = new Date(row.original.date_placed);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      });
      return <span className="text-sm text-subtitle">{formattedDate}</span>;
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
