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
  PER_KG_WEIGHT_THRESHOLDS,
  PRICING_BASIS_OPTIONS,
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
      <p className="mb-1 text-xs font-semibold text-title">Per Kg Pricing</p>
      <p className="mb-2 text-[10px] text-muted-foreground">
        Configure the pricing method and category for everyday wear
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        <PriceInput
          control={service_and_pricing_form.control}
          name={`services.${serviceIndex}.kg_pricing.standard_cost_per_kg` as Path<TServiceAndPricing>}
          label="Standard Service-Cost per kg"
        />
        <PriceInput
          control={service_and_pricing_form.control}
          name={`services.${serviceIndex}.kg_pricing.express_cost_per_kg` as Path<TServiceAndPricing>}
          label="Express Service-Cost per kg"
        />
        <FormField
          control={service_and_pricing_form.control}
          name={`services.${serviceIndex}.kg_pricing.per_kg_weight_threshold` as Path<TServiceAndPricing>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="rounded-lg border border-border px-3 py-2">
                  <p className="text-[10px] font-medium text-label">
                    Per KG weight threshold
                  </p>
                  <select
                    value={Number(field.value ?? 5)}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="mt-0.5 w-full bg-transparent text-sm text-title outline-none"
                  >
                    {PER_KG_WEIGHT_THRESHOLDS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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

  const formatItemId = (id: string) =>
    id.replace(/_/g, "-");

  return (
    <div className="rounded-xl border border-border p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-title">Per Item Pricing</p>
          <p className="text-[10px] text-muted-foreground">
            Configure the pricing method and category for clothing items.
          </p>
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
              pricing_basis_standard: "item",
              pricing_basis_express: "item",
            } as never);
            setSelectedItemId("");
          }}
          disabled={!selectedItemId}
          className={cn(
            "inline-flex h-11 items-center gap-1.5 rounded-lg border px-4 text-xs font-medium transition",
            selectedItemId
              ? "border-landing-accent/60 bg-landing-accent/15 text-title hover:bg-landing-accent/25"
              : "border-dashed border-border text-title opacity-50 cursor-not-allowed"
          )}
        >
          <Plus className="h-4 w-4" />
          Add item
        </button>
      </div>

      <div className="mb-2">
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-title outline-none focus:border-landing-primary"
        >
          <option value="">Select item</option>
          {availableItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({formatItemId(item.id)})
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Loading items...</p>
      ) : fields.length > 0 ? (
        <div className="mt-2 space-y-2">
          {[...fields].reverse().map((field: any, reversedIndex: number) => {
            const itemIndex = fields.length - 1 - reversedIndex;
            return (
              <div
                key={field.id}
                className="flex items-start gap-2 rounded-lg border border-border p-2"
              >
                <div className="flex-1">
                  <p className="mb-1.5 text-xs font-medium text-title">
                    {field.item_name}{" "}
                    <span className="text-muted-foreground">
                      ({formatItemId(field.item_id)})
                    </span>
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-border px-3 py-2">
                      <p className="text-[10px] font-medium text-label">Item</p>
                      <p className="mt-0.5 text-sm text-title">{field.item_name}</p>
                    </div>
                    <FormField
                      control={service_and_pricing_form.control}
                      name={`services.${serviceIndex}.item_pricing.${itemIndex}.pricing_basis_standard` as Path<TServiceAndPricing>}
                      render={({ field: basisField }) => (
                        <FormItem>
                          <FormControl>
                            <div className="rounded-lg border border-border px-3 py-2">
                              <p className="text-[10px] font-medium text-label">
                                Pricing Basis- Standard
                              </p>
                              <select
                                value={String(basisField.value ?? "item")}
                                onChange={(e) => basisField.onChange(e.target.value)}
                                className="mt-0.5 w-full bg-transparent text-sm text-title outline-none"
                              >
                                {PRICING_BASIS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={service_and_pricing_form.control}
                      name={`services.${serviceIndex}.item_pricing.${itemIndex}.pricing_basis_express` as Path<TServiceAndPricing>}
                      render={({ field: basisField }) => (
                        <FormItem>
                          <FormControl>
                            <div className="rounded-lg border border-border px-3 py-2">
                              <p className="text-[10px] font-medium text-label">
                                Pricing Basis- Express Cleaning
                              </p>
                              <select
                                value={String(basisField.value ?? "item")}
                                onChange={(e) => basisField.onChange(e.target.value)}
                                className="mt-0.5 w-full bg-transparent text-sm text-title outline-none"
                              >
                                {PRICING_BASIS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Show price inputs when pricing basis is "item" */}
                  {(service_and_pricing_form.watch(
                    `services.${serviceIndex}.item_pricing.${itemIndex}.pricing_basis_standard` as Path<TServiceAndPricing>
                  ) === "item" ||
                    service_and_pricing_form.watch(
                      `services.${serviceIndex}.item_pricing.${itemIndex}.pricing_basis_express` as Path<TServiceAndPricing>
                    ) === "item") && (
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {service_and_pricing_form.watch(
                          `services.${serviceIndex}.item_pricing.${itemIndex}.pricing_basis_standard` as Path<TServiceAndPricing>
                        ) === "item" && (
                            <PriceInput
                              control={service_and_pricing_form.control}
                              name={`services.${serviceIndex}.item_pricing.${itemIndex}.standard_price` as Path<TServiceAndPricing>}
                              label="Standard price"
                            />
                          )}
                        {service_and_pricing_form.watch(
                          `services.${serviceIndex}.item_pricing.${itemIndex}.pricing_basis_express` as Path<TServiceAndPricing>
                        ) === "item" && (
                            <PriceInput
                              control={service_and_pricing_form.control}
                              name={`services.${serviceIndex}.item_pricing.${itemIndex}.express_price` as Path<TServiceAndPricing>}
                              label="Express price"
                            />
                          )}
                      </div>
                    )}
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
            );
          })}
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
  const { service_and_pricing_form, service_rooms } = useOnboarding();
  const { fields, append, remove } = useFieldArray({
    control: service_and_pricing_form.control,
    name: `services.${serviceIndex}.room_rates` as never,
  });

  // Collect service_room_ids already used in this service
  const usedRoomIds = new Set(
    fields.map((f: any) => f.service_room_id as string).filter(Boolean)
  );

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
                  name={`services.${serviceIndex}.room_rates.${rateIndex}.service_room_id` as Path<TServiceAndPricing>}
                  render={({ field: roomField }) => (
                    <FormItem>
                      <FormControl>
                        <div className="rounded-lg border border-border px-3 py-2">
                          <p className="text-[10px] font-medium text-label">
                            Room / Area type
                          </p>
                          <select
                            value={String(roomField.value ?? "")}
                            onChange={(e) => {
                              roomField.onChange(e.target.value);
                              const room = service_rooms.find(
                                (r) => r.id === e.target.value
                              );
                              service_and_pricing_form.setValue(
                                `services.${serviceIndex}.room_rates.${rateIndex}.room_name` as any,
                                room?.name ?? ""
                              );
                            }}
                            className="mt-0.5 w-full bg-transparent text-sm text-title outline-none"
                          >
                            <option value="">Select room type</option>
                            {service_rooms.map((room) => (
                              <option
                                key={room.id}
                                value={room.id}
                                disabled={
                                  room.id !== String(roomField.value ?? "") &&
                                  usedRoomIds.has(room.id)
                                }
                              >
                                {room.name}
                              </option>
                            ))}
                          </select>
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
            service_room_id: "",
            room_name: "",
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
