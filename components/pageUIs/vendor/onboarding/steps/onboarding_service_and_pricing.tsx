"use client";

import React, { useMemo, useState } from "react";
import { Control, Path, useFieldArray } from "react-hook-form";
import {
  useFetchItems,
} from "@/api/vendor/onboarding/use_fetch_services";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useOnboarding } from "../onboarding_context";
import {
  TServiceAndPricing,
} from "../onboarding_utils";

export const OnboardingServiceAndPricing = () => {
  const { service_and_pricing_form, SERVICE_TYPES, is_branch_vendor } = useOnboarding();

  return (
    <Form {...service_and_pricing_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Services and Pricing
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            {is_branch_vendor
              ? "Set your prices for items and packages for each service."
              : "Add the services you offer and set prices per item or package. You can customize quantities and pricing units for each service."}
          </p>
        </div>

        <div className="space-y-2">
          {SERVICE_TYPES.map((serviceType, index) => (
            <ServiceCard
              key={serviceType.id}
              serviceIndex={index}
              serviceType={serviceType.service_type}
              label={serviceType.label}
              description={serviceType.description}
              isBranch={is_branch_vendor}
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
  serviceIndex,
  serviceType,
  label,
  description,
  isBranch,
}: {
  serviceIndex: number;
  serviceType: "main" | "other";
  label: string;
  description: string;
  isBranch: boolean;
}) => {
  const { service_and_pricing_form } = useOnboarding();
  const enabledPath = `services.${serviceIndex}.enabled` as Path<TServiceAndPricing>;
  const isEnabled = service_and_pricing_form.watch(enabledPath) as boolean;

  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors",
        isEnabled ? "border-landing-primary/40" : "border-border"
      )}
    >
      <div className="flex w-full items-center gap-3 px-4 py-3 text-left">
        {isBranch ? (
          <div className="size-4 shrink-0 rounded-sm border border-landing-accent bg-landing-accent flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-title" />
            </svg>
          </div>
        ) : (
          <Checkbox
            checked={isEnabled}
            onCheckedChange={(checked) =>
              service_and_pricing_form.setValue(
                enabledPath,
                Boolean(checked) as never
              )
            }
            className="size-4 border-muted-foreground/40 data-[state=checked]:border-landing-accent data-[state=checked]:bg-landing-accent data-[state=checked]:text-title"
          />
        )}
        <span className="text-sm font-semibold text-title">{label}</span>
      </div>

      {isEnabled && (
        <div className="border-t border-border px-4 py-3">
          <p className="mb-3 text-xs text-muted-foreground">{description}</p>
          {serviceType === "main" ? (
            <MainServicePricingForm serviceIndex={serviceIndex} />
          ) : (
            <RoomRatePricingForm serviceIndex={serviceIndex} />
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Service: Per-Kg + Per-Item Pricing ─────────────────

const MainServicePricingForm = ({
  serviceIndex,
}: {
  serviceIndex: number;
}) => {
  return (
    <div className="space-y-4">
      <KgPricingSection serviceIndex={serviceIndex} />
      <ItemPricingSection serviceIndex={serviceIndex} />
    </div>
  );
};

const KgPricingSection = ({ serviceIndex }: { serviceIndex: number }) => {
  const { service_and_pricing_form } = useOnboarding();

  return (
    <div className="rounded-xl border border-border p-3">
      <p className="mb-2 text-xs font-semibold text-title">Per Kg Pricing</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <PriceInput
          control={service_and_pricing_form.control}
          name={`services.${serviceIndex}.kg_pricing.standard_cost_per_kg` as Path<TServiceAndPricing>}
          label="Standard (per kg)"
        />
        <PriceInput
          control={service_and_pricing_form.control}
          name={`services.${serviceIndex}.kg_pricing.express_cost_per_kg` as Path<TServiceAndPricing>}
          label="Express (per kg)"
        />
      </div>
    </div>
  );
};

const ItemPricingSection = ({ serviceIndex }: { serviceIndex: number }) => {
  const { service_and_pricing_form } = useOnboarding();
  const { data: allItems = [], isLoading } = useFetchItems();
  const [selectedItemId, setSelectedItemId] = useState("");

  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    name: `services.${serviceIndex}.item_pricing` as never,
  });

  const addedItemIds = useMemo(
    () => fields.map((field: any) => field.item_id),
    [fields]
  );

  const availableItems = useMemo(
    () => allItems.filter((item) => !addedItemIds.includes(item.id)),
    [allItems, addedItemIds]
  );

  return (
    <div className="rounded-xl border border-border p-3">
      <p className="mb-2 text-xs font-semibold text-title">Per Item Pricing</p>

      <div className="flex flex-col gap-2 rounded-lg border border-border p-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-label">
            Add item
          </label>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-title outline-none focus:border-landing-primary"
          >
            <option value="">Select item</option>
            {availableItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            const item = allItems.find((i) => i.id === selectedItemId);
            if (!item) return;
            append({
              item_id: item.id,
              item_name: item.name ?? "",
              standard_price: 0,
              express_price: 0,
            } as never);
            setSelectedItemId("");
          }}
          disabled={!selectedItemId}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-xs font-medium text-title transition hover:border-title disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </div>

      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Loading items...</p>
      ) : fields.length > 0 ? (
        <div className="mt-2 space-y-2">
          {fields.map((field: any, itemIndex: number) => (
            <div
              key={field.id}
              className="flex items-start gap-2 rounded-lg border border-border p-2"
            >
              <div className="flex-1">
                <p className="mb-1.5 text-xs font-medium text-title">
                  {field.item_name}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <PriceInput
                    control={service_and_pricing_form.control}
                    name={`services.${serviceIndex}.item_pricing.${itemIndex}.standard_price` as Path<TServiceAndPricing>}
                    label="Standard price"
                  />
                  <PriceInput
                    control={service_and_pricing_form.control}
                    name={`services.${serviceIndex}.item_pricing.${itemIndex}.express_price` as Path<TServiceAndPricing>}
                    label="Express price"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(itemIndex)}
                className="mt-5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:text-destructive"
                aria-label={`Remove ${field.item_name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 py-2 text-center text-xs text-muted-foreground">
          Add items above to configure per-item pricing.
        </p>
      )}
    </div>
  );
};

// ─── Other Service: Room Rates ───────────────────────────────

const RoomRatePricingForm = ({
  serviceIndex,
}: {
  serviceIndex: number;
}) => {
  const { service_and_pricing_form } = useOnboarding();
  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    name: `services.${serviceIndex}.room_rates` as never,
  });

  return (
    <div className="space-y-2">
      {fields.length > 0 ? (
        fields.map((field: any, rateIndex: number) => (
          <div
            key={field.id}
            className="flex items-start gap-2 rounded-xl border border-border p-3"
          >
            <div className="flex-1">
              <div className="grid gap-2 sm:grid-cols-3">
                <FormField
                  control={service_and_pricing_form.control}
                  name={`services.${serviceIndex}.room_rates.${rateIndex}.room_type` as Path<TServiceAndPricing>}
                  render={({ field: roomField }) => (
                    <FormItem>
                      <FormControl>
                        <div className="rounded-lg border border-border px-3 py-2">
                          <p className="text-[10px] font-medium text-label">
                            Room / Area type
                          </p>
                          <input
                            type="text"
                            placeholder="e.g. 1 Bedroom"
                            value={String(roomField.value ?? "")}
                            onChange={roomField.onChange}
                            className="mt-0.5 w-full bg-transparent text-sm text-title outline-none placeholder:text-muted-foreground"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PriceInput
                  control={service_and_pricing_form.control}
                  name={`services.${serviceIndex}.room_rates.${rateIndex}.regular_cost` as Path<TServiceAndPricing>}
                  label="Regular price"
                />
                <PriceInput
                  control={service_and_pricing_form.control}
                  name={`services.${serviceIndex}.room_rates.${rateIndex}.deep_cost` as Path<TServiceAndPricing>}
                  label="Deep clean price"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => remove(rateIndex)}
              className="mt-5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:text-destructive"
              aria-label={`Remove rate ${rateIndex + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))
      ) : (
        <p className="py-3 text-center text-xs text-muted-foreground">
          Add at least one room/area rate for this service.
        </p>
      )}

      <button
        type="button"
        onClick={() =>
          append({
            room_type: "",
            regular_cost: 0,
            deep_cost: 0,
          } as never)
        }
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-xs font-medium text-title transition hover:border-title"
      >
        <Plus className="h-3.5 w-3.5" />
        Add room / area
      </button>
    </div>
  );
};

// ─── Shared ──────────────────────────────────────────────────

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
