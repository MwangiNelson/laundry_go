"use client";

import React, { useState, useMemo } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import * as countryCodes from "country-codes-list";

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
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

interface CountryData {
  code: string;
  name: string;
  callingCode: string;
}

type BaseInputHTMLProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue" | "value" | "onChange" | "onBlur" | "ref" | "type"
>;

interface PhoneInputProps<TFieldValues extends FieldValues>
  extends BaseInputHTMLProps {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  formItemClassName?: string;
  defaultCountryCode?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const getCountryList = (): CountryData[] => {
  const list = countryCodes.customList(
    "countryCode",
    "{countryCode}|{countryNameEn}|{countryCallingCode}"
  );

  return Object.values(list)
    .map((item) => {
      const [code, name, callingCode] = item.split("|");
      return {
        code,
        name,
        callingCode: callingCode || "",
      };
    })
    .filter((country) => country.callingCode !== "")
    .sort((a, b) => a.name.localeCompare(b.name));
};

interface PhoneInputInnerProps<TFieldValues extends FieldValues>
  extends Omit<
    PhoneInputProps<TFieldValues>,
    "name" | "control" | "formItemClassName" | "description"
  > {
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
  };
  countries: CountryData[];
}

const PhoneInputInner = <TFieldValues extends FieldValues>({
  label,
  className,
  defaultCountryCode = "KE",
  placeholder = "Enter number",
  onChange,
  onBlur,
  field,
  countries,
  ...rest
}: PhoneInputInnerProps<TFieldValues>) => {
  const { formItemId, formDescriptionId, formMessageId, error } =
    useFormField();
  const [open, setOpen] = useState(false);

  // Parse initial value to detect country code
  const parsePhoneNumber = (
    value: string
  ): { country: CountryData; localNumber: string } => {
    if (!value) {
      const defaultCountry = countries.find(
        (c) => c.code === defaultCountryCode
      );
      return {
        country:
          defaultCountry ||
          countries.find((c) => c.code === "KE") ||
          countries[0],
        localNumber: "",
      };
    }

    // Check if value starts with + (E.164 format)
    if (value.startsWith("+")) {
      // Try to match country code
      const sortedCountries = [...countries].sort(
        (a, b) => b.callingCode.length - a.callingCode.length
      );

      for (const country of sortedCountries) {
        if (value.startsWith(`+${country.callingCode}`)) {
          const localNumber = value.slice(country.callingCode.length + 1);
          return { country, localNumber };
        }
      }
    }

    // If no country code detected, use default
    const defaultCountry = countries.find((c) => c.code === defaultCountryCode);
    return {
      country:
        defaultCountry ||
        countries.find((c) => c.code === "KE") ||
        countries[0],
      localNumber: value.replace(/[^0-9]/g, ""),
    };
  };

  const initialParsed = parsePhoneNumber((field.value as string) ?? "");
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    initialParsed.country
  );
  const [localNumber, setLocalNumber] = useState<string>(
    initialParsed.localNumber
  );

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
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-foreground font-medium shrink-0 hover:opacity-70 transition-opacity focus:outline-none"
                aria-label="Select country code"
              >
                <span>+{selectedCountry.callingCode}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={`${country.name} ${country.code} +${country.callingCode}`}
                        onSelect={() => {
                          setSelectedCountry(country);
                          setOpen(false);

                          // Update field with new country code
                          const e164 = localNumber
                            ? `+${country.callingCode}${localNumber}`
                            : "";
                          field.onChange(e164);
                        }}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate">{country.name}</span>
                        <span className="text-muted-foreground text-sm shrink-0">
                          +{country.callingCode}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="h-4 w-px bg-border" />

          <input
            id={formItemId}
            type="tel"
            inputMode="numeric"
            aria-describedby={
              !error
                ? formDescriptionId
                : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...rest}
            value={localNumber}
            onChange={(event) => {
              const value = event.target.value.replace(/[^0-9]/g, "");
              setLocalNumber(value);

              // Update field with E.164 format
              const e164 = value
                ? `+${selectedCountry.callingCode}${value}`
                : "";
              field.onChange(e164);
              onChange?.(event);
            }}
            onBlur={(event) => {
              field.onBlur();
              onBlur?.(event);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export const PhoneInput = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  formItemClassName,
  className,
  defaultCountryCode = "KE",
  placeholder = "Enter number",
  onChange,
  onBlur,
  ...rest
}: PhoneInputProps<TFieldValues>) => {
  const countries = useMemo(() => getCountryList(), []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", formItemClassName)}>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <PhoneInputInner
            label={label}
            className={className}
            defaultCountryCode={defaultCountryCode}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            field={field}
            countries={countries}
            {...rest}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneInput;
