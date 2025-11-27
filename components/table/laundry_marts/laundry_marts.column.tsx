import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ILaundryMartData,
  LaundryMartStatus,
  LaundryMartTab,
} from "./laundry_marts.data";

// Status badge component
const StatusBadge = ({ status }: { status: LaundryMartStatus }) => {
  const statusConfig: Record<
    LaundryMartStatus,
    { label: string; className: string }
  > = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700",
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },
    suspended: {
      label: "Suspended",
      className: "bg-red-100 text-red-700",
    },
    inactive: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn("text-xs", config.className)}>
      {config.label}
    </Badge>
  );
};

// ALL possible columns defined here
export const laundryMartsColumns: ColumnDef<ILaundryMartData>[] = [
  {
    id: "name",
    header: "Laundry Mart",
    accessorKey: "name",
    cell: ({ row }) => {
      const { name, avatar, location } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-title">{name}</span>
            <span className="text-xs text-muted-foreground">{location}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "owner",
    header: "Owner",
    accessorKey: "owner",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "phone",
    header: "Phone",
    accessorKey: "phone",
  },
  {
    id: "totalOrders",
    header: "Total Orders",
    accessorKey: "totalOrders",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.totalOrders.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "revenue",
    header: "Revenue (KES)",
    accessorKey: "revenue",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.revenue.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "rating",
    header: "Rating",
    accessorKey: "rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{rating}</span>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return <StatusBadge status={row.original.status} />;
    },
  },
  {
    id: "joinedDate",
    header: "Joined Date",
    accessorKey: "joinedDate",
  },
];

// Function to get which columns to hide based on tab
export const getHiddenLaundryMartsColumns = (tab: LaundryMartTab): string[] => {
  const hiddenColumns: string[] = [];

  switch (tab) {
    case "all":
      // Show all columns
      break;
    case "active":
      // Hide status since we're filtering by active
      break;
    case "pending":
      // For pending, hide revenue and rating as they may not be relevant yet
      hiddenColumns.push("revenue", "rating", "totalOrders");
      break;
    case "suspended":
      // For suspended, show all to understand why they're suspended
      break;
  }

  return hiddenColumns;
};
