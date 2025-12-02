import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type BaseInputHTMLProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref" | "type"
>;

interface NumberInputProps<TFieldValues extends FieldValues>
  extends BaseInputHTMLProps {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  formItemClassName?: string;
  onChange?: (value: number) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Allow decimal values. Default is false (integers only) */
  allowDecimals?: boolean;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
}

export const NumberInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  formItemClassName,
  className,
  onChange,
  onBlur,
  allowDecimals = false,
  min,
  max,
  ...rest
}: NumberInputProps<TFieldValues>) => {
  const parseValue = (value: string): number => {
    if (value === "" || value === "-") return 0;
    const parsed = allowDecimals ? parseFloat(value) : parseInt(value, 10);
    if (isNaN(parsed)) return 0;
    if (min !== undefined && parsed < min) return min;
    if (max !== undefined && parsed > max) return max;
    return parsed;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("w-full", formItemClassName)}>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormControl>
            <div
              className={cn(
                "relative rounded-2xl border px-4 py-3 transition-colors",
                "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
                fieldState.error && "border-destructive",
                className
              )}
            >
              <div className="flex flex-col gap-1">
                {label && (
                  <label
                    htmlFor={name}
                    className="text-xs font-medium tracking-wide text-label"
                  >
                    {label}
                  </label>
                )}
                <input
                  id={name}
                  type="number"
                  inputMode={allowDecimals ? "decimal" : "numeric"}
                  min={min}
                  max={max}
                  step={allowDecimals ? "any" : "1"}
                  {...rest}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const numValue = parseValue(event.target.value);
                    field.onChange(numValue);
                    onChange?.(numValue);
                  }}
                  onBlur={(event) => {
                    field.onBlur();
                    onBlur?.(event);
                  }}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
