"use client";

import React from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { MergedOption } from "./use_service_merged_data";

interface ServiceOptionRowProps {
  option: MergedOption;
  itemName: string;
  isEditing: boolean;
  isAdding: boolean;
  editingPrice?: number;
  addingPrice?: number;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  onAddStart: () => void;
  onAddCancel: () => void;
  onAddSave: () => void;
  onDelete: () => void;
  onAvailabilityChange: (checked: boolean) => void;
  onAddingPriceChange: (price: number) => void;
  onEditingPriceChange: (price: number) => void;
  isUpdating: boolean;
  isAdding: boolean;
}

export const ServiceOptionRow = ({
  option,
  itemName,
  isEditing,
  isAdding,
  editingPrice,
  addingPrice,
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
  isAdding: isAddingMutation,
}: ServiceOptionRowProps) => {
  // Not added state - show add button
  if (!option.has_vendor_price && !isAdding) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-dashed">
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{option.name}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddStart}
            disabled={isAddingMutation}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    );
  }

  // Adding state - show input form
  if (isAdding) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-md bg-background border">
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm">{option.name}</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={addingPrice || 0}
              onChange={(e) => onAddingPriceChange(parseFloat(e.target.value) || 0)}
              className="w-24 h-8 text-sm"
              min="0"
              step="0.01"
              placeholder="Price"
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={onAddSave}
              disabled={isAddingMutation}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={onAddCancel}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Existing option with vendor price
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-background border">
      <Checkbox checked={option.is_available} onCheckedChange={onAvailabilityChange} />

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
                value={editingPrice || 0}
                onChange={(e) => onEditingPriceChange(parseFloat(e.target.value) || 0)}
                className="w-24 h-8 text-sm"
                min="0"
                step="0.01"
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={onEditSave}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={onEditCancel}
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
                onClick={onEditStart}
              >
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

