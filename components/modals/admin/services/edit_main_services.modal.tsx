import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { useDeleteServiceItem, useFetchServicesAdmin } from "@/api/admin/services/use_services.admin";
import { AddMainServiceItem } from "./add_services_items.modal";
import { EditServiceItemModal } from "./edit_service_items.modal";
import { DeleteServiceItemAlert } from "./delete_service_item_alert";

type ServiceOption = {
  created_at: string | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  name: string;
  service_item_id: string;
  updated_at: string | null;
};

type ServiceItem = {
  created_at: string | null;
  display_order: number | null;
  icon_path: string | null;
  id: string;
  is_active: boolean | null;
  main_service_id: number;
  name: string;
  type: string;
  updated_at: string | null;
  service_options: ServiceOption[];
};

interface EditMainServicesModalProps {
  trigger?: React.ReactNode;
  service_id: number;
}

export const EditMainServicesModal = ({
  trigger,
  service_id,
}: EditMainServicesModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteService, isPending: isDeletingService } =
    useDeleteServiceItem();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const { data: services } = useFetchServicesAdmin();

  const currentService = useMemo(() => {
    return services?.find((service) => {
      return service.id == service_id;
    });
  }, [services, service_id]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleDeleteServiceItem = async () => {
    if (!deleteItemId) return;
    try {
      await deleteService(deleteItemId);
      setDeleteItemId(null);
    } catch (error) {
      console.error("Failed to delete service item:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-6xl space-y-4 rounded-3xl bg-background border-none overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle>Edit Services - {currentService?.service}</DialogTitle>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Service Items</h2>
            <AddMainServiceItem
              trigger={
                <Button variant="outline" size="sm">
                  <PlusIcon size={16} />
                  <span className="ml-2">
                    Add {currentService?.service} Item
                  </span>
                </Button>
              }
              service_slug={
                currentService?.slug as
                  | "laundry"
                  | "moving"
                  | "office_cleaning"
                  | "fumigation"
                  | "house_cleaning"
              }
            />
          </div>

          {/* Services Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentService?.service_items?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No service items available
                    </TableCell>
                  </TableRow>
                ) : (
                  currentService?.service_items?.map((item) => {
                    const hasOptions = item.service_options?.length > 0;
                    const isExpanded = expandedItems.has(item.id);
                    return (
                      <React.Fragment key={item.id}>
                        <TableRow className="hover:bg-muted/50 cursor-pointer">
                          <TableCell
                            onClick={() => toggleExpand(item.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {hasOptions && (
                                <button className="p-1 hover:bg-accent rounded">
                                  {isExpanded ? (
                                    <CaretUpIcon size={16} />
                                  ) : (
                                    <CaretDownIcon size={16} />
                                  )}
                                </button>
                              )}
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="capitalize text-background"
                            >
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className="text-background"
                              variant={item.is_active ? "default" : "secondary"}
                            >
                              {item.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {hasOptions
                              ? `${item.service_options.length} option${
                                  item.service_options.length !== 1 ? "s" : ""
                                }`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <EditServiceItemModal
                                trigger={
                                  <Button size="sm" variant="ghost">
                                    <PencilIcon size={16} />
                                  </Button>
                                }
                                serviceItem={item}
                                serviceSlug={
                                  currentService?.slug as
                                    | "laundry"
                                    | "moving"
                                    | "office_cleaning"
                                    | "fumigation"
                                    | "house_cleaning"
                                }
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteItemId(item.id)}
                                disabled={isDeletingService}
                              >
                                <TrashIcon
                                  size={16}
                                  className="text-destructive"
                                />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {hasOptions && isExpanded && (
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={5} className="p-0">
                              <div className="px-12 py-4">
                                <h4 className="text-sm font-semibold mb-3">
                                  Service Options
                                </h4>
                                <div className="space-y-2">
                                  {item.service_options.map((option) => (
                                    <div
                                      key={option.id}
                                      className="flex items-center justify-between p-3 rounded-lg bg-background border"
                                    >
                                      <div className="flex items-center gap-4 flex-1">
                                        <span className="text-sm font-medium min-w-[150px]">
                                          {option.name}
                                        </span>
                                        {option.description && (
                                          <span className="text-sm text-muted-foreground">
                                            {option.description}
                                          </span>
                                        )}
                                        <Badge
                                          variant={
                                            option.is_active
                                              ? "default"
                                              : "secondary"
                                          }
                                          className="ml-auto text-background"
                                        >
                                          {option.is_active
                                            ? "Active"
                                            : "Inactive"}
                                        </Badge>
                                      </div>
                                    
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>

      <DeleteServiceItemAlert
        open={!!deleteItemId}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
        itemName={
          currentService?.service_items?.find(
            (item) => item.id === deleteItemId
          )?.name || ""
        }
        onConfirm={handleDeleteServiceItem}
        isDeleting={isDeletingService}
      />
    </Dialog>
  );
};
