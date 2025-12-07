"use client";

import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ChevronDown } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SimpleSelectProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export const SimpleSelect = <TFieldValues extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Select",
  className,
  disabled = false,
  onChange,
}: SimpleSelectProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-auto">
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  "h-8 w-auto gap-1.5 rounded-md border bg-background px-2.5 shadow-xs",
                  "text-sm font-normal text-foreground",
                  "focus:ring-1 focus:ring-ring",
                  "[&>svg]:hidden",
                  className
                )}
              >
                <SelectValue placeholder={placeholder} />
                <ChevronDown size={16} className="text-foreground shrink-0" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SimpleSelect;

