"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { VendorServiceData } from "@/api/vendor/services/use_get_vendor_services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  useUpdateVendorPrice,
  useDeleteVendorPrice,
} from "@/api/vendor/services/use_vendor_price_mutations";
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
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const updateMutation = useUpdateVendorPrice();
  const deleteMutation = useDeleteVendorPrice();

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

  // Check if this service has options (like cleaning services)
  const hasOptions = service.service_items.some(
    (item) => item.options.length > 0
  );

  return (
    <div className="flex flex-col gap-4 pt-4">
      {service.service_items.map((item) => {
        if (hasOptions && item.options.length > 0) {
          // Cleaning services with Regular/Deep clean options
          return (
            <div
              key={item.id}
              className="rounded-lg border p-4 bg-accent/20 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {item.type === "area" ? "Area" : "Item"}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {item.options.map((option) => {
                  const isEditing =
                    editingItem?.itemId === item.id &&
                    editingItem?.optionId === option.id;
                  const vendorPriceId = option.vendor_price_id || "";

                  return (
                    <div
                      key={option.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-background border"
                    >
                      <Checkbox
                        checked={option.is_available}
                        onCheckedChange={(checked) => {
                          if (isEditing) {
                            handleSaveEdit(vendorPriceId, checked as boolean);
                          } else {
                            updateMutation.mutate({
                              id: vendorPriceId,
                              price: option.price,
                              is_available: checked as boolean,
                            });
                          }
                        }}
                      />

                      <div className="flex-1 flex items-center justify-between">
                        <span
                          className={cn(
                            "text-sm",
                            !option.is_available && "text-muted-foreground"
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
                                    option.is_available
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
                                KSH {option.price.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() =>
                                  setEditingItem({
                                    itemId: item.id,
                                    optionId: option.id,
                                    price: option.price,
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
          const isEditing =
            editingItem?.itemId === item.id && !editingItem?.optionId;
          const vendorPriceId = item.vendor_price_id || "";
          const price = item.price || 0;
          const isAvailable = item.is_available;

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
