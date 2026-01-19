"use client";

import React, { useState } from "react";
import { VendorServiceData } from "@/api/vendor/services/use_get_vendor_services";
import {
  useAddVendorPrice,
  useUpdateVendorPrice,
  useDeleteVendorPrice,
} from "@/api/vendor/services/use_vendor_price_mutations";
import { useGetAllServiceItems } from "@/api/vendor/services/use_get_all_service_items";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { ServiceItemCard } from "./shared/service_item_card";
import { DeleteServiceDialog } from "./shared/delete_service_dialog";
import { useServiceMergedData } from "./shared/use_service_merged_data";

interface ServiceFormProps {
  service: VendorServiceData;
}

interface EditingItem {
  itemId: string;
  optionId: string | null;
  price: number;
}

interface AddingItem {
  itemId: string;
  optionId: string | null;
  price: number;
}

/**
 * Unified service form component that works for ALL service types:
 * - Laundry (always has options)
 * - House Cleaning (has options)
 * - Office Cleaning (has options)
 * - Moving (no options)
 * - Fumigation (no options)
 */
export const ServiceForm = ({ service }: ServiceFormProps) => {
  const { vendor } = useVendor();
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [addingItem, setAddingItem] = useState<AddingItem | null>(null);

  // Fetch all available service items/options
  const { data: allServiceItems } = useGetAllServiceItems(
    service.main_service_id
  );

  // Merge data - handles both with and without options
  const mergedItems = useServiceMergedData(service, allServiceItems);

  const addMutation = useAddVendorPrice();
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

  const handleAvailabilityChange = (
    vendorPriceId: string,
    price: number,
    checked: boolean
  ) => {
    if (editingItem) {
      handleSaveEdit(vendorPriceId, checked);
    } else {
      updateMutation.mutate({
        id: vendorPriceId,
        price: price,
        is_available: checked,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      {mergedItems.map((item) => (
        <ServiceItemCard
          key={item.id}
          item={item}
          editingItem={editingItem}
          addingItem={addingItem}
          onEditStart={(itemId, optionId, price) =>
            setEditingItem({ itemId, optionId, price })
          }
          onEditCancel={() => setEditingItem(null)}
          onEditSave={handleSaveEdit}
          onAddStart={handleAddItem}
          onAddCancel={() => setAddingItem(null)}
          onAddSave={handleSaveAdd}
          onDelete={(id, name) => setDeleteTarget({ id, name })}
          onAvailabilityChange={handleAvailabilityChange}
          onAddingPriceChange={(price) =>
            setAddingItem((prev) => (prev ? { ...prev, price } : null))
          }
          onEditingPriceChange={(price) =>
            setEditingItem((prev) => (prev ? { ...prev, price } : null))
          }
          isUpdating={updateMutation.isPending}
          isAdding={addMutation.isPending}
        />
      ))}

      <DeleteServiceDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        name={deleteTarget?.name || ""}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

