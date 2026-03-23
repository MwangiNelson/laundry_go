"use client";

import React, { useMemo, useState } from "react";
import { Control, Path, useFieldArray } from "react-hook-form";
import {
  ServiceItemWithOptions,
  useFetchServiceItemsWithOptions,
} from "@/api/vendor/onboarding/use_fetch_services";
import { BasicSelect, SelectOption } from "@/components/fields/select/basic_select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useOnboarding } from "../onboarding_context";
import {
  TCleaningItem,
  TDryCleaningItem,
  TFumigationItem,
  TLaundryItem,
  TMovingItem,
  TServiceAndPricing,
  TServiceKey,
} from "../onboarding_utils";

export const OnboardingServiceAndPricing = () => {
  const { service_and_pricing_form, SERVICE_TYPES } = useOnboarding();

  return (
    <Form {...service_and_pricing_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Services and Pricing
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            Add the services you offer and set prices per item or package. You
            can customize quantities and pricing units for each service.
          </p>
        </div>

        <div className="space-y-2">
          {SERVICE_TYPES.map((service) => (
            <ServiceCard
              key={service.id}
              serviceId={service.id}
              mainServiceId={service.mainServiceId}
              label={service.label}
              title={service.title}
              description={service.description}
            />
          ))}
          <FormMessage>
            {service_and_pricing_form.formState.errors.root?.message}
          </FormMessage>
        </div>
      </form>
    </Form>
  );
};

const ServiceCard = ({
  serviceId,
  mainServiceId,
  label,
  title,
  description,
}: {
  serviceId: TServiceKey;
  mainServiceId: number;
  label: string;
  title: string;
  description: string;
}) => {
  const { service_and_pricing_form } = useOnboarding();
  const enabledPath = `${serviceId}.enabled` as Path<TServiceAndPricing>;
  const isEnabled = service_and_pricing_form.watch(enabledPath) as boolean;

  const toggleEnabled = () => {
    service_and_pricing_form.setValue(enabledPath, !isEnabled as never);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors",
        isEnabled ? "border-landing-primary/40" : "border-border"
      )}
    >
      <button
        type="button"
        onClick={toggleEnabled}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <Checkbox
          checked={isEnabled}
          onCheckedChange={(checked) =>
            service_and_pricing_form.setValue(
              enabledPath,
              Boolean(checked) as never
            )
          }
          onClick={(event) => event.stopPropagation()}
          className="size-4 border-muted-foreground/40 data-[state=checked]:border-landing-accent data-[state=checked]:bg-landing-accent data-[state=checked]:text-title"
        />
        <span className="text-sm font-semibold text-title">{label}</span>
      </button>

      {isEnabled && (
        <div className="border-t border-border px-4 py-3">
          <p className="mb-1 text-xs font-semibold text-title">{title}</p>
          <p className="mb-3 text-xs text-muted-foreground">{description}</p>
          <ServiceItemsForm serviceId={serviceId} mainServiceId={mainServiceId} />
        </div>
      )}
    </div>
  );
};

const ServiceItemsForm = ({
  serviceId,
  mainServiceId,
}: {
  serviceId: TServiceKey;
  mainServiceId: number;
}) => {
  const { data: serviceItems = [], isLoading } =
    useFetchServiceItemsWithOptions(mainServiceId);

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

const LaundryItemsForm = ({
  serviceItems,
  isLoading,
}: {
  serviceItems: ServiceItemWithOptions[];
  isLoading: boolean;
}) => {
  const { service_and_pricing_form } = useOnboarding();
  const [selectedItemId, setSelectedItemId] = useState("");
  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    name: "laundry.items",
  });

  const availableItemOptions: SelectOption[] = useMemo(() => {
    const addedItemIds = fields.map((field) => (field as TLaundryItem).service_item_id);

    return serviceItems
      .filter((item) => !addedItemIds.includes(item.id))
      .map((item) => ({
        value: item.id,
        label: item.name,
      }));
  }, [fields, serviceItems]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading services...</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 rounded-xl border border-border p-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-label">
            Add laundry item
          </label>
          <select
            value={selectedItemId}
            onChange={(event) => setSelectedItemId(event.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-title outline-none focus:border-landing-primary"
          >
            <option value="">Select item</option>
            {availableItemOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            const selectedItem = serviceItems.find(
              (item) => item.id === selectedItemId
            );

            if (!selectedItem) {
              return;
            }

            append({
              service_item_id: selectedItem.id,
              item_name: selectedItem.name,
              options: selectedItem.options.map((option) => ({
                service_option_id: option.id,
                option_name: option.name,
                enabled: true,
                price: 0,
              })),
            });
            setSelectedItemId("");
          }}
          disabled={!selectedItemId}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-xs font-medium text-title transition hover:border-title disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </div>

      {fields.length > 0 ? (
        fields.map((field, itemIndex) => {
          const item = field as TLaundryItem & { id: string };

          return (
            <div
              key={field.id}
              className="rounded-xl border border-border"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
                <p className="text-sm font-semibold text-title">
                  {item.item_name}
                </p>
                <button
                  type="button"
                  onClick={() => remove(itemIndex)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:text-destructive"
                  aria-label={`Remove ${item.item_name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid gap-2 p-3 md:grid-cols-2">
                {item.options.map((option, optionIndex) => {
                  const optEnabledPath =
                    `laundry.items.${itemIndex}.options.${optionIndex}.enabled` as Path<TServiceAndPricing>;
                  const pricePath =
                    `laundry.items.${itemIndex}.options.${optionIndex}.price` as Path<TServiceAndPricing>;
                  const enabled = service_and_pricing_form.watch(optEnabledPath) as boolean;

                  return (
                    <div
                      key={option.service_option_id}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2",
                        enabled ? "border-landing-primary/30" : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            service_and_pricing_form.setValue(
                              optEnabledPath,
                              Boolean(checked) as never
                            )
                          }
                          className="size-3.5 border-muted-foreground/40 data-[state=checked]:border-landing-accent data-[state=checked]:bg-landing-accent data-[state=checked]:text-title"
                        />
                        <span className="text-xs font-medium text-title">
                          {option.option_name}
                        </span>
                      </div>

                      <FormField
                        control={service_and_pricing_form.control}
                        name={pricePath}
                        render={({ field: priceField }) => (
                          <FormItem className="w-[120px]">
                            <FormControl>
                              <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5">
                                <span className="text-xs text-muted-foreground">
                                  KES
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  step={1}
                                  value={Number(priceField.value ?? 0)}
                                  onChange={(event) =>
                                    priceField.onChange(
                                      Number(event.target.value || 0)
                                    )
                                  }
                                  disabled={!enabled}
                                  className="w-full bg-transparent text-xs text-title outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <p className="py-3 text-center text-xs text-muted-foreground">
          Add a laundry item above to configure pricing.
        </p>
      )}
    </div>
  );
};

const GenericServiceItemsForm = ({
  serviceId,
  serviceItems,
  isLoading,
}: {
  serviceId: Exclude<TServiceKey, "laundry">;
  serviceItems: ServiceItemWithOptions[];
  isLoading: boolean;
}) => {
  const { service_and_pricing_form } = useOnboarding();
  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    name: `${serviceId}.items` as never,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading services...</p>;
  }

  return (
    <div className="space-y-2">
      {fields.length > 0 ? (
        fields.map((field, index) => (
          <ServiceItemRow
            key={field.id}
            index={index}
            serviceId={serviceId}
            serviceItems={serviceItems}
            onRemove={() => remove(index)}
          />
        ))
      ) : (
        <p className="py-3 text-center text-xs text-muted-foreground">
          Add at least one billable item for this service.
        </p>
      )}

      <button
        type="button"
        onClick={() => append(getDefaultItem(serviceId) as never)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-xs font-medium text-title transition hover:border-title"
      >
        <Plus className="h-3.5 w-3.5" />
        Add {serviceId === "dry_cleaning" ? "item" : "billable item"}
      </button>
    </div>
  );
};

const ServiceItemRow = ({
  index,
  serviceId,
  serviceItems,
  onRemove,
}: {
  index: number;
  serviceId: Exclude<TServiceKey, "laundry">;
  serviceItems: ServiceItemWithOptions[];
  onRemove: () => void;
}) => {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-border p-3">
      <div className="flex-1">
        <ServiceItemInputs
          serviceId={serviceId}
          index={index}
          serviceItems={serviceItems}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:text-destructive"
        aria-label={`Remove billable item ${index + 1}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const ServiceItemInputs = ({
  serviceId,
  index,
  serviceItems,
}: {
  serviceId: Exclude<TServiceKey, "laundry">;
  index: number;
  serviceItems: ServiceItemWithOptions[];
}) => {
  const { service_and_pricing_form } = useOnboarding();
  const itemOptions: SelectOption[] = useMemo(
    () =>
      serviceItems.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [serviceItems]
  );
  const basePath = `${serviceId}.items.${index}`;
  const serviceItemIdPath =
    `${basePath}.service_item_id` as Path<TServiceAndPricing>;
  const selectedItemId = service_and_pricing_form.watch(serviceItemIdPath);
  const selectedItem = serviceItems.find((item) => item.id === selectedItemId);

  if (
    serviceId === "moving" ||
    serviceId === "fumigation" ||
    serviceId === "dry_cleaning"
  ) {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <BasicSelect
          control={service_and_pricing_form.control}
          name={`${basePath}.service_item_id` as never}
          label={serviceId === "dry_cleaning" ? "Item" : "Item or area"}
          placeholder="Select option"
          options={itemOptions}
          className="rounded-lg px-3 py-2"
        />
        <PriceInput
          control={service_and_pricing_form.control}
          name={`${basePath}.price` as Path<TServiceAndPricing>}
          label="Price"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <BasicSelect
        control={service_and_pricing_form.control}
        name={`${basePath}.service_item_id` as never}
        label="Room or area"
        placeholder="Select"
        options={itemOptions}
        className="rounded-lg px-3 py-2"
        onChange={(value) => {
          const item = serviceItems.find((entry) => entry.id === value);
          const standardOption = item?.options.find((option) =>
            option.name.toLowerCase().includes("regular")
          );
          const deepOption = item?.options.find((option) =>
            option.name.toLowerCase().includes("deep")
          );

          service_and_pricing_form.setValue(
            `${basePath}.regular_clean_option_id` as Path<TServiceAndPricing>,
            standardOption?.id ?? ""
          );
          service_and_pricing_form.setValue(
            `${basePath}.deep_clean_option_id` as Path<TServiceAndPricing>,
            deepOption?.id ?? ""
          );
        }}
      />
      <PriceInput
        control={service_and_pricing_form.control}
        name={`${basePath}.regular_clean_price` as Path<TServiceAndPricing>}
        label="Standard clean price"
      />
      <PriceInput
        control={service_and_pricing_form.control}
        name={`${basePath}.deep_clean_price` as Path<TServiceAndPricing>}
        label="Deep clean price"
      />
    </div>
  );
};

const PriceInput = ({
  control,
  name,
  label,
}: {
  control: Control<TServiceAndPricing>;
  name: Path<TServiceAndPricing>;
  label: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="rounded-lg border border-border px-3 py-2">
              <p className="text-[10px] font-medium text-label">{label}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">KES</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={Number(field.value ?? 0)}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value || 0))
                  }
                  className="w-full bg-transparent text-sm text-title outline-none"
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

const getDefaultItem = (
  serviceId: Exclude<TServiceKey, "laundry">
):
  | TMovingItem
  | TFumigationItem
  | TDryCleaningItem
  | TCleaningItem => {
  if (
    serviceId === "moving" ||
    serviceId === "fumigation" ||
    serviceId === "dry_cleaning"
  ) {
    return {
      service_item_id: "",
      price: 0,
    };
  }

  return {
    service_item_id: "",
    regular_clean_option_id: "",
    regular_clean_price: 0,
    deep_clean_option_id: "",
    deep_clean_price: 0,
  };
};
