"use client";

import React from "react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useOnboarding } from "../onboarding_context";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { SERVICE_TYPES } from "../onboarding_utils";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { NumberInput } from "@/components/fields/inputs/number_input";

type ServiceId = (typeof SERVICE_TYPES)[number]["id"];

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
  serviceId: ServiceId;
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
  const isEnabled = service_and_pricing_form.watch(`${serviceId}.enabled`);

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
        name={`${serviceId}.enabled`}
        render={({ field }) => (
          <FormItem className="flex items-center gap-3 p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
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
  serviceId: ServiceId;
}

const ServiceItemsForm = ({ serviceId }: ServiceItemsFormProps) => {
  const { service_and_pricing_form } = useOnboarding();

  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: `${serviceId}.items` as any,
  });

  const getEmptyItem = (): Record<string, string | number> => {
    switch (serviceId) {
      case "laundry":
        return { item: "", unit: "", cost: 0 };
      case "moving":
      case "fumigation":
        return { room: "", cost: 0 };
      case "house_cleaning":
      case "office_cleaning":
        return { room: "", regular_clean: 0, deep_clean: 0 };
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
  serviceId: ServiceId;
  index: number;
  onRemove: () => void;
  showRemove: boolean;
}

const ServiceItemRow = ({
  serviceId,
  index,
  onRemove,
  showRemove,
}: ServiceItemRowProps) => {
  return (
    <div className="flex items-end gap-3">
      <ServiceItemInputs serviceId={serviceId} index={index} />
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
  serviceId: ServiceId;
  index: number;
}

const ServiceItemInputs = ({ serviceId, index }: ServiceItemInputsProps) => {
  const { service_and_pricing_form } = useOnboarding();

  const basePath = `${serviceId}.items.${index}`;

  switch (serviceId) {
    case "laundry":
      return (
        <div className="grid grid-cols-3 gap-3 flex-1">
          <BasicInput
            control={service_and_pricing_form.control}
            name={`${basePath}.item` as `laundry.items.${number}.item`}
            label="Item"
            placeholder="Shirt"
          />
          <BasicInput
            control={service_and_pricing_form.control}
            name={`${basePath}.unit` as `laundry.items.${number}.unit`}
            label="Unit"
            placeholder="Item"
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={`${basePath}.cost` as `laundry.items.${number}.cost`}
            label="Cost (Kes)"
            placeholder="0"
            min={0}
          />
        </div>
      );

    case "moving":
    case "fumigation":
      return (
        <div className="grid grid-cols-2 gap-3 flex-1">
          <BasicInput
            control={service_and_pricing_form.control}
            name={`${basePath}.room` as `moving.items.${number}.room`}
            label="Room"
            placeholder="Enter room"
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={`${basePath}.cost` as `moving.items.${number}.cost`}
            label="Cost (Kes)"
            placeholder="0"
            min={0}
          />
        </div>
      );

    case "house_cleaning":
    case "office_cleaning":
      return (
        <div className="grid grid-cols-3 gap-3 flex-1">
          <BasicInput
            control={service_and_pricing_form.control}
            name={`${basePath}.room` as `house_cleaning.items.${number}.room`}
            label="Room"
            placeholder="Parking"
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={
              `${basePath}.regular_clean` as `house_cleaning.items.${number}.regular_clean`
            }
            label="Regular Clean (Kes)"
            placeholder="0"
            min={0}
          />
          <NumberInput
            control={service_and_pricing_form.control}
            name={
              `${basePath}.deep_clean` as `house_cleaning.items.${number}.deep_clean`
            }
            label="Deep Clean (Kes)"
            placeholder="0"
            min={0}
          />
        </div>
      );

    default:
      return null;
  }
};
