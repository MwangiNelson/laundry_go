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
import { Rider } from "@/api/vendor/riders/use_fetch_rider";
import { get_profile } from "@/api/supabase/functions";

type RiderStatus = "active" | "inactive";

// Status badge component with dot indicator matching Figma design
const RiderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
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

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <div className="flex items-center gap-1">
      <span className={cn("size-2 rounded-full", config.dotColor)} />
      <span className={cn("text-base", config.textColor)}>{config.label}</span>
    </div>
  );
};

// ALL columns for Riders table (select column is handled by Table_Wrapper)
export const ridersColumns: ColumnDef<Rider>[] = [
  {
    id: "rider",
    header: "Rider",
    accessorFn: (row) => row.user?.full_name,
    cell: ({ row }) => {
      const name = row.original.user?.full_name || "N/A";
      const avatar = row.original.user?.avatar_url;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 border border-secondary">
            <AvatarImage
              src={get_profile(row.original.user_id) || undefined}
              alt={name}
            />
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
    accessorFn: (row) => row.user?.phone,
    cell: ({ row }) => {
      return (
        <span className="text-base text-foreground">
          {row.original.user?.phone || "N/A"}
        </span>
      );
    },
  },
  {
    id: "inProcessOrders",
    header: "In Process Orders",
    accessorKey: "in_process_orders",
    cell: ({ row }) => {
      return (
        <span className="text-base text-foreground">
          {row.original.in_process_orders}
        </span>
      );
    },
  },
  {
    id: "totalDeliveries",
    header: "Total Deliveries",
    accessorKey: "total_deliveries",
    cell: ({ row }) => {
      return (
        <span className="text-base text-foreground">
          {row.original.total_deliveries}
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
