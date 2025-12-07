"use client";

import React, { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface BasicSelectProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: SelectOption[];
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  formItemClassName?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export const BasicSelect = <TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  description,
  placeholder = "Select an option",
  formItemClassName,
  className,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  disabled = false,
  onChange,
}: BasicSelectProps<TFieldValues>) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);

        return (
          <FormItem className={cn("w-full", formItemClassName)}>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                  <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={`${name}-listbox`}
                    className={cn(
                      "relative w-full rounded-2xl border bg-background/80 px-4 py-3 text-left transition-colors",
                      "focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      fieldState.error && "border-destructive",
                      className
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        {label && (
                          <span className="text-xs font-medium tracking-wide text-label">
                            {label}
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-sm truncate",
                            selectedOption
                              ? "text-foreground"
                              : "text-placeholder"
                          )}
                        >
                          {selectedOption?.label || placeholder}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "shrink-0 text-foreground transition-transform",
                          open && "rotate-180"
                        )}
                      />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  id={`${name}-listbox`}
                  className="w-(--radix-popover-trigger-width) p-0"
                  align="start"
                >
                  <Command>
                    {searchable && (
                      <CommandInput placeholder={searchPlaceholder} />
                    )}
                    <CommandList>
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            disabled={option.disabled}
                            onSelect={() => {
                              field.onChange(option.value);
                              onChange?.(option.value);
                              setOpen(false);
                            }}
                            className="flex items-center justify-between"
                          >
                            <span className="truncate">{option.label}</span>
                            {field.value === option.value && (
                              <Check
                                size={16}
                                className="shrink-0 text-primary"
                              />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default BasicSelect;
