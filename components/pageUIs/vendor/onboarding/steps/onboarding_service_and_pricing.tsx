"use client";
import React, { useMemo, useCallback } from "react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useOnboarding } from "../onboarding_context";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, Path } from "react-hook-form";
import { NumberInput } from "@/components/fields/inputs/number_input";
import {
  BasicSelect,
  SelectOption,
} from "@/components/fields/select/basic_select";
import {
  useFetchServiceItemsWithOptions,
  ServiceItemWithOptions,
} from "@/api/vendor/onboarding/use_fetch_services";
import { TServiceAndPricing, TLaundryItem } from "../onboarding_utils";

// Service ID to main_service_id mapping
const SERVICE_NAME_TO_ID: Record<string, number> = {
  laundry: 1,
  moving: 2,
  office_cleaning: 3,
  fumigation: 4,
  house_cleaning: 5,
};

export const OnboardingServiceAndPricing = () => {
  const { service_and_pricing_form, SERVICE_TYPES } = useOnboarding();

  return (
    <Form {...service_and_pricing_form}>
      <form className="flex flex-col gap-4">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h2 className="font-manrope font-bold text-2xl md:text-[32px] leading-tight text-title">
            Services and Pricing
          </h2>
          <p className="font-manrope text-sm leading-normal text-subtitle">
            Add the services you offer and set prices per item or package. You
            can customize quantities and pricing units for each service.
          </p>
        </div>

        {/* Service Cards */}
        <div className="flex flex-col gap-3">
          {SERVICE_TYPES.map((service) => (
            <ServiceCard
              key={service.id}
              serviceId={service.id}
              label={service.label}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </form>
    </Form>
  );
};

interface ServiceCardProps {
  serviceId: string;
  label: string;
  title: string;
  description: string;
}

const ServiceCard = ({
  serviceId,
  label,
  title,
  description,
}: ServiceCardProps) => {
  const { service_and_pricing_form } = useOnboarding();
  const enabledPath = `${serviceId}.enabled` as Path<TServiceAndPricing>;
  const isEnabled = service_and_pricing_form.watch(enabledPath);

  return (
    <div
      className={cn(
        "rounded-xl border bg-background transition-all",
        isEnabled && "border-primary-blue/30 shadow-sm"
      )}
    >
      {/* Service Header with Checkbox */}
      <FormField
        control={service_and_pricing_form.control}
        name={enabledPath}
        render={({ field }) => (
          <FormItem className="flex items-center gap-3 p-4">
            <FormControl>
              <Checkbox
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                className="size-5"
              />
            </FormControl>
            <span className="font-manrope font-semibold text-base text-foreground">
              {label}
            </span>
          </FormItem>
        )}
      />

      {/* Service Content - Only show when enabled */}
      {isEnabled && (
        <div className="px-4 pb-4 pt-0 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-manrope font-bold text-base text-foreground">
              {title}
            </h3>
            <p className="font-manrope text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Dynamic Form based on service type */}
          <ServiceItemsForm serviceId={serviceId} />
        </div>
      )}
    </div>
  );
};

interface ServiceItemsFormProps {
  serviceId: string;
}

const ServiceItemsForm = ({ serviceId }: ServiceItemsFormProps) => {
  const mainServiceId = SERVICE_NAME_TO_ID[serviceId];

  // Fetch service items and options from database
  const { data: serviceItems = [], isLoading } =
    useFetchServiceItemsWithOptions(mainServiceId);

  // Use separate form for laundry with improved UX
  if (serviceId === "laundry") {
    return (
      <LaundryItemsForm serviceItems={serviceItems} isLoading={isLoading} />
    );
  }

  return (
    <GenericServiceItemsForm
      serviceId={serviceId}
      serviceItems={serviceItems}
      isLoading={isLoading}
    />
  );
};

// New Laundry Items Form with improved UX
interface LaundryItemsFormProps {
  serviceItems: ServiceItemWithOptions[];
  isLoading: boolean;
}

const LaundryItemsForm = ({
  serviceItems,
  isLoading,
}: LaundryItemsFormProps) => {
  const { service_and_pricing_form } = useOnboarding();

  const { fields, append, remove, update } = useFieldArray({
    control: service_and_pricing_form.control,
    name: "laundry.items",
  });

  // Convert service items to select options, excluding already added items
  const availableItemOptions: SelectOption[] = useMemo(() => {
    const addedItemIds = fields.map((f) => (f as TLaundryItem).service_item_id);
    return serviceItems
      .filter((item) => !addedItemIds.includes(item.id))
      .map((item) => ({
        value: item.id,
        label: item.name,
      }));
  }, [serviceItems, fields]);

  const handleAddItem = useCallback(
    (itemId: string) => {
      const selectedItem = serviceItems.find((item) => item.id === itemId);
      if (!selectedItem) return;

      // Create laundry item with all options pre-populated
      const newItem: TLaundryItem = {
        service_item_id: selectedItem.id,
        item_name: selectedItem.name,
        options: selectedItem.options.map((opt) => ({
          service_option_id: opt.id,
          option_name: opt.name,
          enabled: true, // Enable all options by default
          price: 0,
        })),
      };

      append(newItem);
    },
    [serviceItems, append]
  );

  const handleToggleOption = useCallback(
    (itemIndex: number, optionIndex: number, enabled: boolean) => {
      const currentItem = fields[itemIndex] as TLaundryItem;
      const updatedOptions = [...currentItem.options];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        enabled,
      };
      update(itemIndex, {
        ...currentItem,
        options: updatedOptions,
      });
    },
    [fields, update]
  );

  const handlePriceChange = useCallback(
    (itemIndex: number, optionIndex: number, price: number) => {
      const currentItem = fields[itemIndex] as TLaundryItem;
      const updatedOptions = [...currentItem.options];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        price,
      };
      update(itemIndex, {
        ...currentItem,
        options: updatedOptions,
      });
    },
    [fields, update]
  );

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading services...</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Added Items List */}
      {fields.map((field, itemIndex) => {
        const item = field as TLaundryItem & { id: string };
        return (
          <div
            key={field.id}
            className="rounded-lg border bg-muted/30 overflow-hidden"
          >
            {/* Item Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
              <span className="font-manrope font-semibold text-sm text-foreground">
                {item.item_name}
              </span>
              <button
                type="button"
                onClick={() => remove(itemIndex)}
                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Service Options */}
            <div className="p-4 flex flex-col gap-3">
              <span className="font-manrope text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Service Options
              </span>
              {item.options.map((option, optionIndex) => (
                <div
                  key={option.service_option_id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg border transition-all",
                    option.enabled
                      ? "bg-background border-primary-blue/20"
                      : "bg-muted/20 border-muted opacity-60"
                  )}
                >
                  {/* Toggle Switch */}
                  <Switch
                    checked={option.enabled}
                    onCheckedChange={(checked) =>
                      handleToggleOption(itemIndex, optionIndex, checked)
                    }
                  />

                  {/* Option Name */}
                  <span
                    className={cn(
                      "font-manrope text-sm flex-1",
                      option.enabled
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {option.option_name}
                  </span>

                  {/* Price Input */}
                  <div className="w-32">
                    <div
                      className={cn(
                        "relative rounded-xl border px-3 py-2 transition-colors",
                        "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
                        !option.enabled && "opacity-50"
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-medium tracking-wide text-label">
                          Price (Kes)
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          value={option.price || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10) || 0;
                            handlePriceChange(itemIndex, optionIndex, value);
                          }}
                          disabled={!option.enabled}
                          placeholder="0"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Item Section */}
      {availableItemOptions.length > 0 && (
        <div className="flex flex-col gap-2">
          <BasicSelect
            control={service_and_pricing_form.control}
            name={"laundry._tempItemSelect" as Path<TServiceAndPricing>}
            label="Select Item"
            placeholder="Choose an item to add"
            options={availableItemOptions}
            searchable
            onChange={(value) => {
              handleAddItem(value);
              // Reset the temp select after adding
              service_and_pricing_form.setValue(
                "laundry._tempItemSelect" as Path<TServiceAndPricing>,
                "" as never
              );
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {fields.length === 0 && availableItemOptions.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No laundry items available
        </div>
      )}
    </div>
  );
};

// Generic Service Items Form for other services (moving, cleaning, fumigation)
interface GenericServiceItemsFormProps {
  serviceId: string;
  serviceItems: ServiceItemWithOptions[];
  isLoading: boolean;
}

const GenericServiceItemsForm = ({
  serviceId,
  serviceItems,
  isLoading,
}: GenericServiceItemsFormProps) => {
  const { service_and_pricing_form } = useOnboarding();

  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: `${serviceId}.items` as any,
  });

  const getEmptyItem = (): Record<string, string | number> => {
    switch (serviceId) {
      case "moving":
      case "fumigation":
        return { service_item_id: "", price: 0 };
      case "house_cleaning":
      case "office_cleaning":
        return {
          service_item_id: "",
          regular_clean_option_id: "",
          regular_clean_price: 0,
          deep_clean_option_id: "",
          deep_clean_price: 0,
        };
      default:
        return {};
    }
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading services...</div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-manrope text-sm text-muted-foreground">
        Add Room/ Place
      </span>

      {fields.map((field, index) => (
        <ServiceItemRow
          key={field.id}
          serviceId={serviceId}
          index={index}
          onRemove={() => remove(index)}
          showRemove={fields.length > 0}
          serviceItems={serviceItems}
        />
      ))}

      {/* Add Item Button */}
      <button
        type="button"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={() => append(getEmptyItem() as any)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-end"
      >
        <Plus size={16} />
        <span>Add Room</span>
      </button>
    </div>
  );
};

interface ServiceItemRowProps {
  serviceId: string;
  index: number;
  onRemove: () => void;
  showRemove: boolean;
  serviceItems: import("@/api/vendor/onboarding/use_fetch_services").ServiceItemWithOptions[];
}

const ServiceItemRow = ({
  serviceId,
  index,
  onRemove,
  showRemove,
  serviceItems,
}: ServiceItemRowProps) => {
  return (
    <div className="flex items-end gap-3">
      <ServiceItemInputs
        serviceId={serviceId}
        index={index}
        serviceItems={serviceItems}
      />
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors mb-1"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

interface ServiceItemInputsProps {
  serviceId: string;
  index: number;
  serviceItems: import("@/api/vendor/onboarding/use_fetch_services").ServiceItemWithOptions[];
}

const ServiceItemInputs = ({
  serviceId,
  index,
  serviceItems,
}: ServiceItemInputsProps) => {
  const { service_and_pricing_form } = useOnboarding();

  const basePath = `${serviceId}.items.${index}`;

  // Convert service items to select options
  const itemOptions: SelectOption[] = useMemo(
    () =>
      serviceItems.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [serviceItems]
  );

  // Get selected item's options for cleaning services
  const serviceItemPath =
    `${basePath}.service_item_id` as Path<TServiceAndPricing>;
  const selectedItemId = service_and_pricing_form.watch(serviceItemPath);
  const selectedItem = serviceItems.find((item) => item.id === selectedItemId);

  switch (serviceId) {
    case "moving":
    case "fumigation":
      return (
        <div className="grid grid-cols-2 gap-3 flex-1">
          <BasicSelect
            control={service_and_pricing_form.control}
            name={
              `${basePath}.service_item_id` as `moving.items.${number}.service_item_id`
            }
            label="Room/Place"
            placeholder="Select room"
            options={itemOptions}
            searchable
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={`${basePath}.price` as `moving.items.${number}.price`}
            label="Price (Kes)"
            placeholder="0"
            min={0}
          />
        </div>
      );

    case "house_cleaning":
    case "office_cleaning":
      // Find regular and deep clean options
      const regularCleanOption = selectedItem?.options.find((opt) =>
        opt.name.toLowerCase().includes("regular")
      );
      const deepCleanOption = selectedItem?.options.find((opt) =>
        opt.name.toLowerCase().includes("deep")
      );

      return (
        <div className="grid grid-cols-3 gap-3 flex-1">
          <BasicSelect
            control={service_and_pricing_form.control}
            name={
              `${basePath}.service_item_id` as `house_cleaning.items.${number}.service_item_id`
            }
            label="Room/Place"
            placeholder="Select room"
            options={itemOptions}
            searchable
            onChange={(value) => {
              // Auto-select options when room is selected
              const item = serviceItems.find((i) => i.id === value);
              if (item) {
                const regular = item.options.find((opt) =>
                  opt.name.toLowerCase().includes("regular")
                );
                const deep = item.options.find((opt) =>
                  opt.name.toLowerCase().includes("deep")
                );
                if (regular) {
                  const regularPath =
                    `${basePath}.regular_clean_option_id` as Path<TServiceAndPricing>;
                  service_and_pricing_form.setValue(regularPath, regular.id);
                }
                if (deep) {
                  const deepPath =
                    `${basePath}.deep_clean_option_id` as Path<TServiceAndPricing>;
                  service_and_pricing_form.setValue(deepPath, deep.id);
                }
              }
            }}
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={
              `${basePath}.regular_clean_price` as `house_cleaning.items.${number}.regular_clean_price`
            }
            label="Regular Clean (Kes)"
            placeholder="0"
            min={0}
            disabled={!regularCleanOption}
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={
              `${basePath}.deep_clean_price` as `house_cleaning.items.${number}.deep_clean_price`
            }
            label="Deep Clean (Kes)"
            placeholder="0"
            min={0}
            disabled={!deepCleanOption}
          />
        </div>
      );

    default:
      return null;
  }
};
