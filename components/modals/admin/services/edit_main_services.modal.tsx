import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { Database } from "@/database.types";
import {
  useDeleteServiceItem,
  useFetchServicesAdmin,
} from "@/api/admin/services/use_services.admin";
import { AddMainServiceItem } from "./add_services_items.modal";
import { EditServiceItemModal } from "./edit_service_items.modal";
import { DeleteServiceItemAlert } from "./delete_service_item_alert";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data: services } = useFetchServicesAdmin();

  const currentService = useMemo(() => {
    return services?.find((service) => {
      return service.id == service_id;
    });
  }, [services, service_id]);

  const filteredServiceItems = useMemo(() => {
    if (!currentService?.service_items) return [];

    const search = searchTerm.trim().toLowerCase();

    return currentService.service_items.filter((item) => {
      if (statusFilter === "active" && !item.is_active) return false;
      if (statusFilter === "inactive" && item.is_active) return false;

      if (!search) return true;

      const itemMatches = item.name.toLowerCase().includes(search);
      const optionMatches = item.service_options?.some((option) => {
        return (
          option.name.toLowerCase().includes(search) ||
          option.description?.toLowerCase().includes(search)
        );
      });

      return itemMatches || optionMatches;
    });
  }, [currentService, searchTerm, statusFilter]);

  const totalPages = useMemo(() => {
    if (filteredServiceItems.length === 0) return 1;
    return Math.ceil(filteredServiceItems.length / pageSize);
  }, [filteredServiceItems.length, pageSize]);

  const safePage = Math.min(page, totalPages || 1);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredServiceItems.slice(start, start + pageSize);
  }, [filteredServiceItems, safePage, pageSize]);

  const pageStart =
    filteredServiceItems.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const pageEnd = Math.min(filteredServiceItems.length, safePage * pageSize);

  React.useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

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

      <DialogContent className="sm:max-w-6xl space-y-4 rounded-3xl bg-background border-none overflow-hidden max-h-[90vh]">
        <DialogTitle>Edit Services - {currentService?.service}</DialogTitle>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
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

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Input
                placeholder="Search by name or option"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "active" | "inactive") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Services Table */}
          <div className="rounded-lg border max-h-[55vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentService?.service_items?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No service items available
                    </TableCell>
                  </TableRow>
                ) : filteredServiceItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No service items match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => {
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
                            <TableCell colSpan={4} className="p-0">
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

          {filteredServiceItems.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {pageStart}-{pageEnd} of {filteredServiceItems.length}
              </div>
              {filteredServiceItems.length > pageSize && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          if (safePage > 1) {
                            setPage(safePage - 1);
                          }
                        }}
                        className={
                          safePage === 1
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === safePage}
                          size="default"
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          if (safePage < totalPages) {
                            setPage(safePage + 1);
                          }
                        }}
                        className={
                          safePage === totalPages
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
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
