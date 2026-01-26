import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VendorService } from "@/api/vendor/services/use_fetch_services";

const AvailabilityBadge = ({ isAvailable }: { isAvailable: boolean }) => {
  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          "size-2 rounded-full",
          isAvailable ? "bg-chart-1" : "bg-destructive"
        )}
      />
      <span
        className={cn(
          "text-base",
          isAvailable ? "text-chart-1" : "text-destructive"
        )}
      >
        {isAvailable ? "Available" : "Unavailable"}
      </span>
    </div>
  );
};

// Service columns for the table
export const servicesColumns: ColumnDef<VendorService>[] = [
  //   {
  //     id: "service",
  //     header: "Service",
  //     accessorFn: (row) => row.main_service?.service,
  //     cell: ({ row }) => {
  //       const serviceName = row.original.main_service?.service || "N/A";
  //       return (
  //         <Badge variant="outline" className="text-base">
  //           {serviceName}
  //         </Badge>
  //       );
  //     },
  //   },
  {
    id: "item",
    header: "Item/Area",
    accessorFn: (row) => row.service_item?.name,
    cell: ({ row }) => {
      const itemName = row.original.service_item?.name || "N/A";
      const itemType = row.original.service_item?.type || "item";
      return (
        <div className="flex flex-col gap-1">
          <span className="text-base text-foreground font-medium">
            {itemName}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {itemType}
          </span>
        </div>
      );
    },
  },
  {
    id: "option",
    header: "Option",
    accessorFn: (row) => row.service_option?.name,
    cell: ({ row }) => {
      const optionName = row.original.service_option?.name || "-";
      const description = row.original.service_option?.description;
      return (
        <div className="flex flex-col gap-1">
          <span className="text-base text-foreground">{optionName}</span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "price",
    header: "Price (KES)",
    accessorKey: "price",
    cell: ({ row }) => {
      const price = row.original.price;
      return (
        <span className="text-base text-foreground font-semibold">
          {price.toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    id: "availability",
    header: "Availability",
    accessorKey: "is_available",
    cell: ({ row }) => {
      return <AvailabilityBadge isAvailable={row.original.is_available} />;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  console.log("Edit service:", service);
                  // Add edit logic here
                }}
              >
                Edit Price
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  console.log("Toggle availability:", service);
                  // Add toggle availability logic here
                }}
              >
                {service.is_available ? "Mark Unavailable" : "Mark Available"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
