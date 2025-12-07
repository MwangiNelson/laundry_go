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
import { IRiderData, RiderStatus } from "./riders.data";

// Status badge component with dot indicator matching Figma design
const RiderStatusBadge = ({ status }: { status: RiderStatus }) => {
  const statusConfig: Record<
    RiderStatus,
    { label: string; dotColor: string; textColor: string }
  > = {
    active: {
      label: "Active",
      dotColor: "bg-chart-1",
      textColor: "text-chart-1",
    },
    inactive: {
      label: "Inactive",
      dotColor: "bg-destructive",
      textColor: "text-destructive",
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

// ALL columns for Riders table (select column is handled by Table_Wrapper)
export const ridersColumns: ColumnDef<IRiderData>[] = [
  {
    id: "rider",
    header: "Rider",
    accessorKey: "name",
    cell: ({ row }) => {
      const { name, avatar } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 border border-secondary">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-base text-foreground">{name}</span>
        </div>
      );
    },
  },
  {
    id: "phone",
    header: "Phone",
    accessorKey: "phone",
    cell: ({ row }) => {
      return (
        <span className="text-base text-foreground">{row.original.phone}</span>
      );
    },
  },
  {
    id: "inProcessOrders",
    header: "In Process Orders",
    accessorKey: "inProcessOrders",
    cell: ({ row }) => {
      return (
        <span className="text-base text-foreground">
          {row.original.inProcessOrders}
        </span>
      );
    },
  },
  {
    id: "totalDeliveries",
    header: "Total Deliveries",
    accessorKey: "totalDeliveries",
    cell: ({ row }) => {
      return (
        <span className="text-base text-foreground">
          {row.original.totalDeliveries}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return <RiderStatusBadge status={row.original.status} />;
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
              onClick={() => console.log("View rider:", row.original.id)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit rider:", row.original.id)}
            >
              Edit Rider
            </DropdownMenuItem>
            {row.original.status === "active" ? (
              <DropdownMenuItem
                onClick={() => console.log("Deactivate:", row.original.id)}
                className="text-destructive"
              >
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => console.log("Activate:", row.original.id)}
                className="text-chart-1"
              >
                Activate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
