"use client";

import React from "react";
import { LaundryServiceOptionRow } from "./laundry_service_option_row";

interface MergedOption {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  vendor_price_id?: string;
  has_vendor_price: boolean;
}

interface MergedItem {
  id: string;
  name: string;
  options: MergedOption[];
}

interface LaundryServiceItemCardProps {
  item: MergedItem;
  editingOption: { itemId: string; optionId: string; price: number } | null;
  addingOption: { itemId: string; optionId: string; price: number } | null;
  onEditStart: (itemId: string, optionId: string, price: number) => void;
  onEditCancel: () => void;
  onEditSave: (vendorPriceId: string, isAvailable: boolean) => void;
  onAddStart: (itemId: string, optionId: string) => void;
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

export const LaundryServiceItemCard = ({
  item,
  editingOption,
  addingOption,
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
}: LaundryServiceItemCardProps) => {
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
          <LaundryServiceOptionRow
            key={option.id}
            option={option}
            itemName={item.name}
            isEditing={editingOption?.itemId === item.id && editingOption?.optionId === option.id}
            isAdding={addingOption?.itemId === item.id && addingOption?.optionId === option.id}
            editingPrice={editingOption?.price}
            addingPrice={addingOption?.price}
            onEditStart={() => onEditStart(item.id, option.id, option.price)}
            onEditCancel={onEditCancel}
            onEditSave={() => onEditSave(option.vendor_price_id || "", option.is_available)}
            onAddStart={() => onAddStart(item.id, option.id)}
            onAddCancel={onAddCancel}
            onAddSave={onAddSave}
            onDelete={() => onDelete(option.vendor_price_id || "", `${item.name} - ${option.name}`)}
            onAvailabilityChange={(checked) =>
              onAvailabilityChange(option.vendor_price_id || "", option.price, checked)
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
};

