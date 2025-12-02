import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ITransactionData, TransactionStatus } from "./transactions.data";

// Status badge component with dot indicator matching Figma design
const TransactionStatusBadge = ({ status }: { status: TransactionStatus }) => {
  const statusConfig: Record<
    TransactionStatus,
    { label: string; dotColor: string; textColor: string }
  > = {
    paid: {
      label: "Paid",
      dotColor: "bg-[#4aa785]",
      textColor: "text-[#4aa785]",
    },
    refunded: {
      label: "Refunded",
      dotColor: "bg-[#d4595b]",
      textColor: "text-[#d4595b]",
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

// Order items stacked avatars component
const OrderItemsCell = ({
  items,
}: {
  items: { id: string; image: string }[];
}) => {
  const displayItems = items.slice(0, 4);
  const itemCount = items.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className="size-5 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
            style={{ zIndex: displayItems.length - index }}
          >
            <img src={item.image} alt="" className="size-full object-cover" />
          </div>
        ))}
      </div>
      <span className="text-sm text-black">{itemCount} items</span>
    </div>
  );
};

// ALL columns for Transactions table
export const transactionsColumns: ColumnDef<ITransactionData>[] = [
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
    id: "orderItems",
    header: "Order Items",
    accessorKey: "orderItems",
    cell: ({ row }) => {
      return <OrderItemsCell items={row.original.orderItems} />;
    },
  },
  {
    id: "amount",
    header: "Amount (kes)",
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <span className="text-title">
          {row.original.amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "pickupTime",
    header: "PickUp Time",
    accessorKey: "pickupTime",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Clock className="size-4 text-title" />
          <span className="text-title">{row.original.pickupTime}</span>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return <TransactionStatusBadge status={row.original.status} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => console.log("View transaction:", row.original.id)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Download receipt:", row.original.id)}
            >
              Download Receipt
            </DropdownMenuItem>
            {row.original.status === "paid" && (
              <DropdownMenuItem
                onClick={() => console.log("Refund:", row.original.id)}
                className="text-red-600"
              >
                Refund
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
