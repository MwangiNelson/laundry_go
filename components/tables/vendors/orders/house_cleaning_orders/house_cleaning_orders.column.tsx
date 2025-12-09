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
import {
  IHouseCleaningOrderData,
  HouseCleaningOrderStatus,
} from "./house_cleaning_orders.data";

// Status badge component with dot indicator matching Figma design
const OrderStatusBadge = ({ status }: { status: HouseCleaningOrderStatus }) => {
  const statusConfig: Record<
    HouseCleaningOrderStatus,
    { label: string; dotColor: string; textColor: string }
  > = {
    ongoing: {
      label: "Ongoing",
      dotColor: "bg-blue-500",
      textColor: "text-blue-500",
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

// ALL columns for House Cleaning Orders table
export const houseCleaningOrdersColumns: ColumnDef<IHouseCleaningOrderData>[] =
  [
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
      id: "service",
      header: "Service",
      accessorKey: "service",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-foreground">
            {row.original.service}
          </span>
        );
      },
    },
    {
      id: "cleaningDate",
      header: "Cleaning Date",
      accessorKey: "cleaningDate",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-foreground">
            {row.original.cleaningDate}
          </span>
        );
      },
    },
    {
      id: "houseLocations",
      header: "House locations",
      accessorKey: "houseLocations",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-foreground">
            {row.original.houseLocations}
          </span>
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
