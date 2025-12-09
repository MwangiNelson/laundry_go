"use client";
import React, { useMemo } from "react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useOnboarding } from "../onboarding_context";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, Path } from "react-hook-form";
import { NumberInput } from "@/components/fields/inputs/number_input";
import {
  BasicSelect,
  SelectOption,
} from "@/components/fields/select/basic_select";
import { useFetchServiceItemsWithOptions } from "@/api/vendor/onboarding/use_fetch_services";
import { TServiceAndPricing } from "../onboarding_utils";

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
  const { service_and_pricing_form } = useOnboarding();
  const mainServiceId = SERVICE_NAME_TO_ID[serviceId];

  // Fetch service items and options from database
  const { data: serviceItems = [], isLoading } =
    useFetchServiceItemsWithOptions(mainServiceId);

  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: `${serviceId}.items` as any,
  });

  const getEmptyItem = (): Record<string, string | number> => {
    switch (serviceId) {
      case "laundry":
        return { service_item_id: "", service_option_id: "", price: 0 };
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

  const getAddButtonLabel = () => {
    switch (serviceId) {
      case "laundry":
        return "Add item";
      default:
        return "Add Room";
    }
  };

  const getSectionLabel = () => {
    switch (serviceId) {
      case "laundry":
        return null;
      default:
        return "Add Room/ Place";
    }
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading services...</div>
    );
  }

  const sectionLabel = getSectionLabel();

  return (
    <div className="flex flex-col gap-3">
      {sectionLabel && (
        <span className="font-manrope text-sm text-muted-foreground">
          {sectionLabel}
        </span>
      )}

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
        <span>{getAddButtonLabel()}</span>
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

  // Get selected item's options
  const serviceItemPath =
    `${basePath}.service_item_id` as Path<TServiceAndPricing>;
  const selectedItemId = service_and_pricing_form.watch(serviceItemPath);
  const selectedItem = serviceItems.find((item) => item.id === selectedItemId);

  const optionsList: SelectOption[] = useMemo(
    () =>
      (selectedItem?.options || []).map((option) => ({
        value: option.id,
        label: option.name,
      })),
    [selectedItem]
  );

  switch (serviceId) {
    case "laundry":
      return (
        <div className="grid grid-cols-3 gap-3 flex-1">
          <BasicSelect
            control={service_and_pricing_form.control}
            name={
              `${basePath}.service_item_id` as `laundry.items.${number}.service_item_id`
            }
            label="Item"
            placeholder="Select item"
            options={itemOptions}
            searchable
          />
          <BasicSelect
            control={service_and_pricing_form.control}
            name={
              `${basePath}.service_option_id` as `laundry.items.${number}.service_option_id`
            }
            label="Service"
            placeholder="Select service"
            options={optionsList}
            disabled={!selectedItemId || optionsList.length === 0}
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={`${basePath}.price` as `laundry.items.${number}.price`}
            label="Price (Kes)"
            placeholder="0"
            min={0}
          />
        </div>
      );

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
