"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { VendorServiceData } from "@/api/vendor/services/use_get_vendor_services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  useAddVendorPrice,
  useUpdateVendorPrice,
  useDeleteVendorPrice,
} from "@/api/vendor/services/use_vendor_price_mutations";
import { useGetAllServiceItems } from "@/api/vendor/services/use_get_all_service_items";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GenericServiceFormProps {
  service: VendorServiceData;
}

interface EditingItem {
  itemId: string;
  optionId: string | null;
  price: number;
}

export const GenericServiceForm = ({ service }: GenericServiceFormProps) => {
  const { vendor } = useVendor();
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [addingItem, setAddingItem] = useState<{
    itemId: string;
    optionId: string | null;
    price: number;
  } | null>(null);

  // Fetch all available service items/options
  const { data: allServiceItems } = useGetAllServiceItems(
    service.main_service_id
  );

  const addMutation = useAddVendorPrice();
  const updateMutation = useUpdateVendorPrice();
  const deleteMutation = useDeleteVendorPrice();

  // Merge all available items/options with vendor's existing prices
  const mergedItems = useMemo(() => {
    if (!allServiceItems) return service.service_items;

    return allServiceItems.service_items.map((allItem) => {
      // Find vendor's existing item
      const vendorItem = service.service_items.find(
        (item) => item.id === allItem.id
      );

      // If item has options, merge them
      if (allItem.options.length > 0) {
        const mergedOptions = allItem.options.map((allOption) => {
          const vendorOption = vendorItem?.options.find(
            (opt) => opt.id === allOption.id
          );

          return {
            ...allOption,
            price: vendorOption?.price || 0,
            is_available: vendorOption?.is_available || false,
            vendor_price_id: vendorOption?.vendor_price_id,
            has_vendor_price: !!vendorOption,
          } as typeof allOption & {
            price: number;
            is_available: boolean;
            vendor_price_id?: string;
            has_vendor_price: boolean;
          };
        });

        return {
          ...allItem,
          options: mergedOptions,
        };
      } else {
        // Item without options
        return {
          ...allItem,
          price: vendorItem?.price || 0,
          is_available: vendorItem?.is_available || false,
          vendor_price_id: vendorItem?.vendor_price_id,
          has_vendor_price: !!vendorItem,
        } as typeof allItem & {
          price: number;
          is_available: boolean;
          vendor_price_id?: string;
          has_vendor_price: boolean;
        };
      }
    });
  }, [allServiceItems, service.service_items]);

  const handleSaveEdit = (vendorPriceId: string, isAvailable: boolean) => {
    if (!editingItem) return;

    updateMutation.mutate(
      {
        id: vendorPriceId,
        price: editingItem.price,
        is_available: isAvailable,
      },
      {
        onSuccess: () => {
          setEditingItem(null);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      }
    );
  };

  const handleAddItem = (itemId: string, optionId: string | null) => {
    setAddingItem({
      itemId,
      optionId,
      price: 0,
    });
  };

  const handleSaveAdd = () => {
    if (!addingItem || !vendor?.id) return;

    addMutation.mutate(
      {
        vendor_id: vendor.id,
        service_item_id: addingItem.itemId,
        service_option_id: addingItem.optionId,
        price: addingItem.price,
        is_available: true,
      },
      {
        onSuccess: () => {
          setAddingItem(null);
        },
      }
    );
  };

  // Check if this service has options (like cleaning services)
  const hasOptions = mergedItems.some((item) => item.options.length > 0);

  return (
    <div className="flex flex-col gap-4 pt-4">
      {mergedItems.map((item) => {
        if (hasOptions && item.options.length > 0) {
          // Cleaning services with Regular/Deep clean options
          return (
            <div
              key={item.id}
              className="rounded-lg border p-4 bg-accent/20 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">{item.name}</h4>
              </div>

              <div className="flex flex-col gap-2">
                {item.options.map((option) => {
                  const mergedOption = option as typeof option & {
                    has_vendor_price: boolean;
                    vendor_price_id?: string;
                    price: number;
                    is_available: boolean;
                  };
                  const isEditing =
                    editingItem?.itemId === item.id &&
                    editingItem?.optionId === option.id;
                  const isAdding =
                    addingItem?.itemId === item.id &&
                    addingItem?.optionId === option.id;
                  const vendorPriceId = mergedOption.vendor_price_id || "";
                  const hasVendorPrice = mergedOption.has_vendor_price;

                  // If option doesn't have vendor price, show add button
                  if (!hasVendorPrice && !isAdding) {
                    return (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-dashed"
                      >
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {option.name}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddItem(item.id, option.id)}
                            disabled={addMutation.isPending}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  // If adding, show input form
                  if (isAdding) {
                    return (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 p-3 rounded-md bg-background border"
                      >
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm">{option.name}</span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={addingItem.price}
                              onChange={(e) =>
                                setAddingItem({
                                  ...addingItem,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-24 h-8 text-sm"
                              min="0"
                              step="0.01"
                              placeholder="Price"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={handleSaveAdd}
                              disabled={addMutation.isPending}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => setAddingItem(null)}
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={option.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-background border"
                    >
                      <Checkbox
                        checked={mergedOption.is_available}
                        onCheckedChange={(checked) => {
                          if (isEditing) {
                            handleSaveEdit(vendorPriceId, checked as boolean);
                          } else {
                            updateMutation.mutate({
                              id: vendorPriceId,
                              price: mergedOption.price,
                              is_available: checked as boolean,
                            });
                          }
                        }}
                      />

                      <div className="flex-1 flex items-center justify-between">
                        <span
                          className={cn(
                            "text-sm",
                            !mergedOption.is_available &&
                              "text-muted-foreground"
                          )}
                        >
                          {option.name}
                        </span>

                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Input
                                type="number"
                                value={editingItem.price}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-24 h-8 text-sm"
                                min="0"
                                step="0.01"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  handleSaveEdit(
                                    vendorPriceId,
                                    mergedOption.is_available
                                  )
                                }
                                disabled={updateMutation.isPending}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setEditingItem(null)}
                              >
                                <X className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-medium min-w-[60px] text-right">
                                KSH {mergedOption.price.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  setEditingItem({
                                    itemId: item.id,
                                    optionId: option.id,
                                    price: mergedOption.price,
                                  })
                                }
                              >
                                <Edit2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  setDeleteTarget({
                                    id: vendorPriceId,
                                    name: `${item.name} - ${option.name}`,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else {
          // Simple items without options (moving, fumigation)
          const mergedSimpleItem = item as typeof item & {
            price: number;
            is_available: boolean;
            has_vendor_price: boolean;
            vendor_price_id?: string;
          };
          const isEditing =
            editingItem?.itemId === item.id && !editingItem?.optionId;
          const isAdding =
            addingItem?.itemId === item.id && !addingItem?.optionId;
          const vendorPriceId = mergedSimpleItem.vendor_price_id || "";
          const price = mergedSimpleItem.price || 0;
          const isAvailable = mergedSimpleItem.is_available;
          const hasVendorPrice = mergedSimpleItem.has_vendor_price;

          // If item doesn't have vendor price, show add button
          if (!hasVendorPrice && !isAdding) {
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-dashed"
              >
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddItem(item.id, null)}
                    disabled={addMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            );
          }

          // If adding, show input form
          if (isAdding) {
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-md bg-background border"
              >
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={addingItem.price}
                      onChange={(e) =>
                        setAddingItem({
                          ...addingItem,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24 h-8 text-sm"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={handleSaveAdd}
                      disabled={addMutation.isPending}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => setAddingItem(null)}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-md bg-background border"
            >
              <Checkbox
                checked={isAvailable}
                onCheckedChange={(checked) => {
                  if (isEditing) {
                    handleSaveEdit(vendorPriceId, checked as boolean);
                  } else {
                    updateMutation.mutate({
                      id: vendorPriceId,
                      price: price,
                      is_available: checked as boolean,
                    });
                  }
                }}
              />

              <div className="flex-1 flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isAvailable && "text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-24 h-8 text-sm"
                        min="0"
                        step="0.01"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          handleSaveEdit(vendorPriceId, isAvailable)
                        }
                        disabled={updateMutation.isPending}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingItem(null)}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium min-w-[60px] text-right">
                        KSH {price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setEditingItem({
                            itemId: item.id,
                            optionId: null,
                            price: price,
                          })
                        }
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setDeleteTarget({
                            id: vendorPriceId,
                            name: item.name,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        }
      })}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{deleteTarget?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
