"use client";

import React, { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type BaseInputHTMLProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref" | "type"
>;

interface PasswordInputProps<TFieldValues extends FieldValues>
  extends BaseInputHTMLProps {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  formItemClassName?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const PasswordInputInner = React.forwardRef<
  HTMLInputElement,
  Omit<PasswordInputProps<FieldValues>, "control" | "name"> & {
    field: {
      value: string;
      onChange: (value: string) => void;
      onBlur: () => void;
    };
  }
>(({ label, className, onChange, onBlur, field, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const { formItemId, formDescriptionId, error } = useFormField();

  return (
    <div
      className={cn(
        "relative rounded-2xl border px-4 py-3 transition-colors",
        "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
        error && "border-destructive",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={formItemId}
            className="text-xs font-medium tracking-wide text-label"
          >
            {label}
          </label>
        )}
        <div className="flex items-center gap-1">
          <input
            ref={ref}
            id={formItemId}
            type={showPassword ? "text" : "password"}
            aria-describedby={formDescriptionId}
            aria-invalid={!!error}
            {...rest}
            value={field.value ?? ""}
            onChange={(event) => {
              field.onChange(event.target.value);
              onChange?.(event);
            }}
            onBlur={(event) => {
              field.onBlur();
              onBlur?.(event);
            }}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="shrink-0 text-secondary hover:text-label transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
});
PasswordInputInner.displayName = "PasswordInputInner";

export const PasswordInput = <TFieldValues extends FieldValues>({
  name,
  control,
  description,
  formItemClassName,
  ...rest
}: PasswordInputProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", formItemClassName)}>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <PasswordInputInner field={field} {...rest} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
