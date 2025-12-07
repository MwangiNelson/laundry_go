import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

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
  "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref"
>;

interface BasicInputProps<TFieldValues extends FieldValues>
  extends BaseInputHTMLProps {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  formItemClassName?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const BasicInputInner = <TFieldValues extends FieldValues>({
  label,
  className,
  onChange,
  onBlur,
  type = "text",
  field,
  ...rest
}: Omit<
  BasicInputProps<TFieldValues>,
  "name" | "control" | "formItemClassName" | "description"
> & {
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
  };
}) => {
  const { formItemId, formDescriptionId, formMessageId, error } =
    useFormField();

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
        <input
          id={formItemId}
          type={type}
          aria-describedby={
            !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          {...rest}
          {...field}
          value={(field.value as string) ?? ""}
          onChange={(event) => {
            field.onChange(event.target.value);
            onChange?.(event);
          }}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event);
          }}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
};

export const BasicInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  formItemClassName,
  className,
  onChange,
  onBlur,
  type = "text",
  ...rest
}: BasicInputProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", formItemClassName)}>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <BasicInputInner
            label={label}
            className={className}
            onChange={onChange}
            onBlur={onBlur}
            type={type}
            field={field}
            {...rest}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
