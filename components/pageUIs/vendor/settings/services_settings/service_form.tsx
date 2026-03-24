"use client";

import React, { useState, useMemo } from "react";
import {
  VendorServiceData,
  VendorServiceItemPricing,
  VendorServiceRoomRate,
} from "@/api/vendor/services/use_get_vendor_services";
import { useGetAllItems, Item } from "@/api/vendor/services/use_get_all_service_items";
import {
  useUpsertKgPricing,
  useAddItemPricing,
  useUpdateItemPricing,
  useDeleteItemPricing,
  useAddRoomRate,
  useUpdateRoomRate,
  useDeleteRoomRate,
} from "@/api/vendor/services/use_vendor_price_mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

interface ServiceFormProps {
  service: VendorServiceData;
}

export const ServiceForm = ({ service }: ServiceFormProps) => {
  if (service.service_type === "main") {
    return <MainServiceForm service={service} />;
  }
  return <OtherServiceForm service={service} />;
};

// ─── Main Service: Kg Pricing + Item Pricing ────────────────

const MainServiceForm = ({ service }: { service: VendorServiceData }) => {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <KgPricingSection service={service} />
      <ItemPricingSection service={service} />
    </div>
  );
};

const KgPricingSection = ({ service }: { service: VendorServiceData }) => {
  const upsertKg = useUpsertKgPricing();
  const [standardKg, setStandardKg] = useState(
    service.kg_pricing?.standard_cost_per_kg ?? 0
  );
  const [expressKg, setExpressKg] = useState(
    service.kg_pricing?.express_cost_per_kg ?? 0
  );
  const hasChanged =
    standardKg !== (service.kg_pricing?.standard_cost_per_kg ?? 0) ||
    expressKg !== (service.kg_pricing?.express_cost_per_kg ?? 0);

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">Per Kg Pricing</h4>
        {hasChanged && (
          <Button
            size="sm"
            variant="outline"
            disabled={upsertKg.isPending}
            onClick={() =>
              upsertKg.mutate({
                vendor_service_id: service.id,
                standard_cost_per_kg: standardKg,
                express_cost_per_kg: expressKg,
              })
            }
          >
            {upsertKg.isPending ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Standard (KES/kg)
          </label>
          <Input
            type="number"
            min={0}
            value={standardKg}
            onChange={(e) => setStandardKg(Number(e.target.value || 0))}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Express (KES/kg)
          </label>
          <Input
            type="number"
            min={0}
            value={expressKg}
            onChange={(e) => setExpressKg(Number(e.target.value || 0))}
          />
        </div>
      </div>
    </div>
  );
};

const ItemPricingSection = ({ service }: { service: VendorServiceData }) => {
  const { data: allItems = [] } = useGetAllItems();
  const addItem = useAddItemPricing();
  const updateItem = useUpdateItemPricing();
  const deleteItem = useDeleteItemPricing();

  const [selectedItemId, setSelectedItemId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStandard, setEditStandard] = useState(0);
  const [editExpress, setEditExpress] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const addedItemIds = useMemo(
    () => service.item_pricing.map((ip) => ip.item_id),
    [service.item_pricing]
  );
  const availableItems = useMemo(
    () => allItems.filter((item) => !addedItemIds.includes(item.id)),
    [allItems, addedItemIds]
  );

  const startEdit = (ip: VendorServiceItemPricing) => {
    setEditingId(ip.id);
    setEditStandard(ip.standard_price ?? 0);
    setEditExpress(ip.express_price ?? 0);
  };

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-medium text-sm mb-3">Per Item Pricing</h4>

      {/* Add item row */}
      <div className="flex gap-2 mb-3">
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          className="h-9 flex-1 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Select item to add</option>
          {availableItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="outline"
          disabled={!selectedItemId || addItem.isPending}
          onClick={() => {
            addItem.mutate(
              {
                vendor_service_id: service.id,
                item_id: selectedItemId,
                standard_price: 0,
                express_price: 0,
              },
              { onSuccess: () => setSelectedItemId("") }
            );
          }}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>

      {/* Item list */}
      {service.item_pricing.length > 0 ? (
        <div className="flex flex-col gap-2">
          {service.item_pricing.map((ip) => {
            const isEditing = editingId === ip.id;
            return (
              <div
                key={ip.id}
                className="flex items-center gap-2 rounded-lg border p-3"
              >
                <span className="text-sm font-medium min-w-[100px]">
                  {ip.item_name ?? "Unknown"}
                </span>
                {isEditing ? (
                  <>
                    <Input
                      type="number"
                      min={0}
                      value={editStandard}
                      onChange={(e) =>
                        setEditStandard(Number(e.target.value || 0))
                      }
                      className="w-24 h-8"
                      placeholder="Standard"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={editExpress}
                      onChange={(e) =>
                        setEditExpress(Number(e.target.value || 0))
                      }
                      className="w-24 h-8"
                      placeholder="Express"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={updateItem.isPending}
                      onClick={() =>
                        updateItem.mutate(
                          {
                            id: ip.id,
                            standard_price: editStandard,
                            express_price: editExpress,
                          },
                          { onSuccess: () => setEditingId(null) }
                        )
                      }
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-muted-foreground">
                      Std: KES {ip.standard_price ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Exp: KES {ip.express_price ?? 0}
                    </span>
                    <div className="ml-auto flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => startEdit(ip)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setDeleteTarget({
                            id: ip.id,
                            name: ip.item_name ?? "item",
                          })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground py-3">
          No per-item pricing configured yet.
        </p>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item pricing entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget)
                  deleteItem.mutate(
                    { id: deleteTarget.id },
                    { onSuccess: () => setDeleteTarget(null) }
                  );
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteItem.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ─── Other Service: Room Rates ──────────────────────────────

const OtherServiceForm = ({ service }: { service: VendorServiceData }) => {
  const addRate = useAddRoomRate();
  const updateRate = useUpdateRoomRate();
  const deleteRate = useDeleteRoomRate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRoomType, setEditRoomType] = useState("");
  const [editRegular, setEditRegular] = useState(0);
  const [editDeep, setEditDeep] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const startEdit = (rr: VendorServiceRoomRate) => {
    setEditingId(rr.id);
    setEditRoomType(rr.room_type);
    setEditRegular(rr.regular_cost ?? 0);
    setEditDeep(rr.deep_cost ?? 0);
  };

  return (
    <div className="flex flex-col gap-3 pt-4">
      <h4 className="font-medium text-sm">Room / Area Rates</h4>

      {service.room_rates.length > 0 ? (
        <div className="flex flex-col gap-2">
          {service.room_rates.map((rr) => {
            const isEditing = editingId === rr.id;
            return (
              <div
                key={rr.id}
                className="flex items-center gap-2 rounded-lg border p-3"
              >
                {isEditing ? (
                  <>
                    <Input
                      type="text"
                      value={editRoomType}
                      onChange={(e) => setEditRoomType(e.target.value)}
                      className="flex-1 h-8"
                      placeholder="Room type"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={editRegular}
                      onChange={(e) =>
                        setEditRegular(Number(e.target.value || 0))
                      }
                      className="w-24 h-8"
                      placeholder="Regular"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={editDeep}
                      onChange={(e) =>
                        setEditDeep(Number(e.target.value || 0))
                      }
                      className="w-24 h-8"
                      placeholder="Deep"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      disabled={updateRate.isPending}
                      onClick={() =>
                        updateRate.mutate(
                          {
                            id: rr.id,
                            room_type: editRoomType,
                            regular_cost: editRegular,
                            deep_cost: editDeep,
                          },
                          { onSuccess: () => setEditingId(null) }
                        )
                      }
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium min-w-[100px]">
                      {rr.room_type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Regular: KES {rr.regular_cost ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Deep: KES {rr.deep_cost ?? 0}
                    </span>
                    <div className="ml-auto flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => startEdit(rr)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setDeleteTarget({ id: rr.id, name: rr.room_type })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground py-3">
          No room rates configured yet.
        </p>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={addRate.isPending}
        onClick={() =>
          addRate.mutate({
            vendor_service_id: service.id,
            room_type: "",
            regular_cost: 0,
            deep_cost: 0,
          })
        }
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add room / area
      </Button>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {deleteTarget?.name || "rate"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this room rate entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget)
                  deleteRate.mutate(
                    { id: deleteTarget.id },
                    { onSuccess: () => setDeleteTarget(null) }
                  );
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRate.isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
