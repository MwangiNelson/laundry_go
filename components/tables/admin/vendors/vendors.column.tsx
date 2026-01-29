"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IVendor } from "@/api/admin/vendors/use_fetch_vendors";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { VendorActionsCell } from "@/components/modals/admin/vendors/vendor_actions_cell";

export const vendorsColumns: ColumnDef<IVendor>[] = [
  {
    id: "business_name",
    header: "Business Name",
    accessorKey: "business_name",
    cell: ({ row }) => {
      const { business_name, logo_url, email, id } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={logo_url || ""} alt={business_name || "Vendor"} />
            <AvatarFallback>
              {(business_name || email || "V").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-title">
              {business_name || "Unnamed Business"}
            </span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "admin",
    header: "Added By",
    cell: ({ row }) => {
      const { admin } = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-title">
            {admin?.full_name || "N/A"}
          </span>
          {admin?.email && (
            <span className="text-xs text-muted-foreground">{admin.email}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const { phone, email } = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-title">{phone || "N/A"}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      );
    },
  },
  {
    id: "services",
    header: "Services",
    cell: ({ row }) => {
      const { services } = row.original;
      if (!services || services.length === 0) {
        return (
          <span className="text-sm text-muted-foreground">No services</span>
        );
      }
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-title font-medium">
            {services.length} {services.length === 1 ? "Service" : "Services"}
          </span>
          <span className="text-xs text-muted-foreground">
            {services.map((s) => s.service).join(", ")}
          </span>
        </div>
      );
    },
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const { address } = row.original;
      return (
        <Badge variant="secondary" className="bg-primary-blue text-title">
          {address || "N/A"}
        </Badge>
      );
    },
  },
  {
    id: "created_at",
    header: "Added",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const { created_at } = row.original;
      return (
        <Badge variant="secondary" className="bg-primary-blue text-title">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <VendorActionsCell vendor={vendor} />
        </div>
      );
    },
  },
];

// Helper function to get hidden columns based on viewport
export const getHiddenVendorsColumns = () => {
  return {};
};
