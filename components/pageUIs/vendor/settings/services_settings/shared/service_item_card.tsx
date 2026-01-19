"use client";

import React from "react";
import { ServiceOptionRow } from "./service_option_row";
import { ServiceItemRow } from "./service_item_row";
import { MergedItem } from "./use_service_merged_data";

interface ServiceItemCardProps {
  item: MergedItem;
  editingItem: { itemId: string; optionId: string | null; price: number } | null;
  addingItem: { itemId: string; optionId: string | null; price: number } | null;
  onEditStart: (itemId: string, optionId: string | null, price: number) => void;
  onEditCancel: () => void;
  onEditSave: (vendorPriceId: string, isAvailable: boolean) => void;
  onAddStart: (itemId: string, optionId: string | null) => void;
  onAddCancel: () => void;
  onAddSave: () => void;
  onDelete: (vendorPriceId: string, name: string) => void;
  onAvailabilityChange: (
    vendorPriceId: string,
    price: number,
    checked: boolean
  ) => void;
  onAddingPriceChange: (price: number) => void;
  onEditingPriceChange: (price: number) => void;
  isUpdating: boolean;
  isAdding: boolean;
}

export const ServiceItemCard = ({
  item,
  editingItem,
  addingItem,
  onEditStart,
  onEditCancel,
  onEditSave,
  onAddStart,
  onAddCancel,
  onAddSave,
  onDelete,
  onAvailabilityChange,
  onAddingPriceChange,
  onEditingPriceChange,
  isUpdating,
  isAdding,
}: ServiceItemCardProps) => {
  const hasOptions = item.options.length > 0;

  if (hasOptions) {
    // Service items with options (laundry, house_cleaning, office_cleaning)
    return (
      <div className="rounded-lg border p-4 bg-accent/20 hover:bg-accent/30 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">{item.name}</h4>
          <span className="text-xs text-muted-foreground">
            {item.options.length} {item.options.length === 1 ? "option" : "options"}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {item.options.map((option) => (
            <ServiceOptionRow
              key={option.id}
              option={option}
              itemName={item.name}
              isEditing={
                editingItem?.itemId === item.id &&
                editingItem?.optionId === option.id
              }
              isAdding={
                addingItem?.itemId === item.id &&
                addingItem?.optionId === option.id
              }
              editingPrice={editingItem?.price}
              addingPrice={addingItem?.price}
              onEditStart={() => onEditStart(item.id, option.id, option.price)}
              onEditCancel={onEditCancel}
              onEditSave={() =>
                onEditSave(option.vendor_price_id || "", option.is_available)
              }
              onAddStart={() => onAddStart(item.id, option.id)}
              onAddCancel={onAddCancel}
              onAddSave={onAddSave}
              onDelete={() =>
                onDelete(option.vendor_price_id || "", `${item.name} - ${option.name}`)
              }
              onAvailabilityChange={(checked) =>
                onAvailabilityChange(
                  option.vendor_price_id || "",
                  option.price,
                  checked
                )
              }
              onAddingPriceChange={onAddingPriceChange}
              onEditingPriceChange={onEditingPriceChange}
              isUpdating={isUpdating}
              isAddingMutation={isAdding}
            />
          ))}
        </div>
      </div>
    );
  } else {
    // Service items without options (moving, fumigation)
    return (
      <ServiceItemRow
        item={item}
        isEditing={editingItem?.itemId === item.id && !editingItem?.optionId}
        isAdding={addingItem?.itemId === item.id && !addingItem?.optionId}
        editingPrice={editingItem?.price}
        addingPrice={addingItem?.price}
        onEditStart={() =>
          onEditStart(item.id, null, item.price || 0)
        }
        onEditCancel={onEditCancel}
        onEditSave={() =>
          onEditSave(item.vendor_price_id || "", item.is_available || false)
        }
        onAddStart={() => onAddStart(item.id, null)}
        onAddCancel={onAddCancel}
        onAddSave={onAddSave}
        onDelete={() => onDelete(item.vendor_price_id || "", item.name)}
        onAvailabilityChange={(checked) =>
          onAvailabilityChange(item.vendor_price_id || "", item.price || 0, checked)
        }
        onAddingPriceChange={onAddingPriceChange}
        onEditingPriceChange={onEditingPriceChange}
        isUpdating={isUpdating}
        isAddingMutation={isAdding}
      />
    );
  }
};

