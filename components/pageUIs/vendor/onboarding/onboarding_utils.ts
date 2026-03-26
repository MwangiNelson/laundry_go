import { locationSchema } from "@/components/schema/shared.schema";
import { Tables } from "@/database.types";
import { z } from "zod";

// ─── Service Types (New Schema) ──────────────────────────────

export type TService = Tables<"services">;
export type TItem = Tables<"items">;

export const INDIVIDUAL_STEPS = [
  { key: "business_information", title: "Business Information" },
  { key: "business_type", title: "Business Type" },
  { key: "services_and_pricing", title: "Services & Pricing" },
  { key: "operations_setup", title: "Operations Setup" },
  { key: "finances_and_terms", title: "Finances & Terms" },
] as const;

export const MULTI_BRANCH_STEPS = [
  { key: "business_information", title: "Business Information" },
  { key: "business_type", title: "Business Type" },
  { key: "services_and_pricing", title: "Services & Pricing" },
  { key: "branch_information", title: "Branch Information" },
] as const;

export const BRANCH_STEPS = [
  { key: "services_and_pricing", title: "Services & Pricing" },
  { key: "operations_setup", title: "Operations Setup" },
  { key: "finances", title: "Finances" },
] as const;

/** @deprecated Use INDIVIDUAL_STEPS or MULTI_BRANCH_STEPS based on business type */
export const ONBOARDING_STEPS = INDIVIDUAL_STEPS;

export type TOnboardingStepKey =
  | (typeof INDIVIDUAL_STEPS)[number]["key"]
  | (typeof MULTI_BRANCH_STEPS)[number]["key"]
  | (typeof BRANCH_STEPS)[number]["key"]
  | "branch_details";

export type TOnboardingStep = { key: TOnboardingStepKey; title: string };

export const getStepsForBusinessType = (
  businessType: "individual" | "multi_branch" | "branch"
): readonly TOnboardingStep[] => {
  if (businessType === "branch") return BRANCH_STEPS;
  if (businessType === "multi_branch") return MULTI_BRANCH_STEPS;
  return INDIVIDUAL_STEPS;
};

export type TServiceType = {
  id: string;
  label: string;
  service_type: "main" | "other";
  description: string;
  image_url: string | null;
};

const toStepIndexMap = (steps: readonly TOnboardingStep[] = INDIVIDUAL_STEPS) =>
  new Map(steps.map((step, index) => [step.key, index]));

export const getOnboardingStepIndex = (
  stepKey: string | null | undefined,
  steps: readonly TOnboardingStep[] = INDIVIDUAL_STEPS
): number => {
  const stepIndexMap = toStepIndexMap(steps);
  if (!stepKey) {
    return 0;
  }
  return stepIndexMap.get(stepKey as TOnboardingStepKey) ?? 0;
};

export const getOnboardingStepKey = (
  stepIndex: number,
  steps: readonly TOnboardingStep[] = INDIVIDUAL_STEPS
): TOnboardingStepKey =>
  (steps[stepIndex]?.key as TOnboardingStepKey) ?? (steps[0].key as TOnboardingStepKey);

export const getNextOnboardingStep = (
  stepKey: TOnboardingStepKey,
  steps: readonly TOnboardingStep[] = INDIVIDUAL_STEPS
): TOnboardingStepKey | null => {
  const currentIndex = getOnboardingStepIndex(stepKey, steps);
  return (steps[currentIndex + 1]?.key as TOnboardingStepKey) ?? null;
};

export const getCompletedStepsFromProgress = (
  signupStep: string | null | undefined,
  profileComplete?: boolean | null,
  steps: readonly TOnboardingStep[] = INDIVIDUAL_STEPS
) => {
  if (profileComplete) {
    return steps.map((_, index) => index);
  }

  const currentIndex = getOnboardingStepIndex(signupStep, steps);
  return steps.slice(0, currentIndex).map((_, index) => index);
};

const getServiceDescription = (serviceType: string, name: string): string => {
  if (serviceType === "main") {
    return `Configure per-kg and per-item pricing for ${name.toLowerCase()}.`;
  }
  return `Set room rates for ${name.toLowerCase()} services.`;
};

export const convertToServiceTypes = (
  services: TService[]
): TServiceType[] =>
  services.map((service) => ({
    id: service.id,
    label: service.name ?? "Unknown Service",
    service_type: (service.service_type ?? "main") as "main" | "other",
    description: getServiceDescription(
      service.service_type ?? "main",
      service.name ?? ""
    ),
    image_url: service.service_image_url,
  }));

const file_value = z
  .union([z.instanceof(File), z.string().url()])
  .optional()
  .nullable();

const business_location = locationSchema.nullable();

export const business_information = z.object({
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  location: business_location,
  logo: file_value,
  business_license: file_value,
});

export const business_type = z.object({
  business_type: z.enum(["individual", "multi_branch"], {
    message: "Please select your business type",
  }),
});

export const PER_KG_WEIGHT_THRESHOLDS = [
  { value: 3, label: "3kg" },
  { value: 5, label: "5kg" },
  { value: 7, label: "7kg" },
  { value: 10, label: "10kg" },
] as const;

const kg_pricing_schema = z.object({
  standard_cost_per_kg: z.number().min(0, "Price must be positive"),
  express_cost_per_kg: z.number().min(0, "Price must be positive"),
  per_kg_weight_threshold: z.number().min(0, "Threshold must be positive"),
});

export const PRICING_BASIS_OPTIONS = [
  { value: "item", label: "Item" },
  { value: "per_kg", label: "Per KG" },
] as const;

export type TPricingBasis = (typeof PRICING_BASIS_OPTIONS)[number]["value"];

const item_pricing_entry = z.object({
  item_id: z.string().min(1, "Item is required"),
  item_name: z.string(),
  standard_price: z.number().min(0, "Price must be positive"),
  express_price: z.number().min(0, "Price must be positive"),
  pricing_basis_standard: z.enum(["item", "per_kg"]),
  pricing_basis_express: z.enum(["item", "per_kg"]),
});

const room_rate_entry = z.object({
  service_room_id: z.string().min(1, "Room type is required"),
  room_name: z.string(),
  regular_cost: z.number().min(0, "Price must be positive"),
  deep_cost: z.number().min(0, "Price must be positive"),
});

const service_entry_schema = z.object({
  enabled: z.boolean(),
  service_id: z.string(),
  service_name: z.string(),
  service_type: z.enum(["main", "other"]),
  kg_pricing: kg_pricing_schema,
  item_pricing: z.array(item_pricing_entry),
  room_rates: z.array(room_rate_entry),
});

export const service_and_pricing_base = z.object({
  services: z.array(service_entry_schema),
});

export const service_and_pricing = service_and_pricing_base
  .refine(
    (data) => data.services.some((s) => s.enabled),
    { message: "Please select at least one service" }
  )
  .refine(
    (data) =>
      data.services.every((service) => {
        if (!service.enabled) return true;
        if (service.service_type === "main") {
          return (
            service.kg_pricing.standard_cost_per_kg > 0 ||
            service.item_pricing.length > 0
          );
        }
        return service.room_rates.length > 0;
      }),
    { message: "Each enabled service must have pricing configured" }
  );

export const day_hours = z
  .object({
    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    end_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  })
  .optional();

export const operation_hours = z
  .object({
    sunday: day_hours,
    monday: day_hours,
    tuesday: day_hours,
    wednesday: day_hours,
    thursday: day_hours,
    friday: day_hours,
    saturday: day_hours,
  })
  .refine(
    (data) =>
      Object.values(data).some(
        (value) => value?.start_time && value?.end_time
      ),
    {
      message: "Please add at least one working day",
    }
  );

const cleanRichTextHtml = (value: string) =>
  value.replace(/<\/?(script|style)[^>]*>/gi, "").trim();

export const extractPlainTextFromHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const finances_and_terms = z.object({
  bank_name: z.string().min(2, "Please enter your bank name"),
  bank_account_name: z
    .string()
    .min(2, "Please enter the account holder name"),
  bank_account_number: z
    .string()
    .min(6, "Please enter a valid account number"),
  terms_and_conditions: z
    .string()
    .transform(cleanRichTextHtml)
    .refine((value) => extractPlainTextFromHtml(value).length >= 10, {
      message: "Please add your terms and conditions",
    }),
});

export type TKgPricing = z.infer<typeof kg_pricing_schema>;
export type TItemPricingEntry = z.infer<typeof item_pricing_entry>;
export type TRoomRateEntry = z.infer<typeof room_rate_entry>;
export type TServiceEntry = z.infer<typeof service_entry_schema>;
export type TBusinessInformation = z.infer<typeof business_information>;
export type TBusinessType = z.infer<typeof business_type>;
export type TServiceAndPricing = z.infer<typeof service_and_pricing_base>;
export type TOperationHours = z.infer<typeof operation_hours>;
export type TFinancesAndTerms = z.infer<typeof finances_and_terms>;

// --- Branch Information (multi-branch flow) ---

const branch_schema = z.object({
  id: z.string().optional(),
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  location: locationSchema.nullable(),
  email: z.string().email("Please enter a valid email address"),
  contact_person: z.string().min(2, "Please enter the contact person name"),
  contact_phone: z.string().min(10, "Please enter a valid phone number"),
  contact_email: z.string().email("Please enter a valid email address"),
});

export const branch_information = z.object({
  branches: z
    .array(branch_schema)
    .min(1, "Please add at least one branch"),
});

export type TBranch = z.infer<typeof branch_schema>;
export type TBranchInformation = z.infer<typeof branch_information>;

export const createDefaultBranchInformation = (): TBranchInformation => ({
  branches: [],
});

// --- Branch Details (branch onboarding flow) ---

export const branch_details = z.object({
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  location: locationSchema.nullable(),
});

export type TBranchDetails = z.infer<typeof branch_details>;

export const createDefaultBranchDetails = (): TBranchDetails => ({
  branch_name: "",
  location: null,
});

export const branch_finances = z.object({
  bank_name: z.string().min(2, "Please enter your bank name"),
  bank_account_name: z.string().min(2, "Please enter the account holder name"),
  bank_account_number: z.string().min(6, "Please enter a valid account number"),
  terms_and_conditions: z
    .string()
    .transform(cleanRichTextHtml)
    .refine((value) => extractPlainTextFromHtml(value).length >= 10, {
      message: "Please add your terms and conditions",
    }),
});

export type TBranchFinances = z.infer<typeof branch_finances>;

export const createDefaultBranchFinances = (): TBranchFinances => ({
  bank_name: "",
  bank_account_name: "",
  bank_account_number: "",
  terms_and_conditions: "",
});

export const createEmptyServiceEntry = (service: TService): TServiceEntry => ({
  enabled: false,
  service_id: service.id,
  service_name: service.name ?? "",
  service_type: (service.service_type ?? "main") as "main" | "other",
  kg_pricing: { standard_cost_per_kg: 0, express_cost_per_kg: 0, per_kg_weight_threshold: 5 },
  item_pricing: [],
  room_rates: [],
});

export const createEmptyServiceAndPricing = (
  services: TService[] = []
): TServiceAndPricing => ({
  services: services.map(createEmptyServiceEntry),
});

export const createDefaultOperationHours = (): TOperationHours => ({
  sunday: undefined,
  monday: { start_time: "08:00", end_time: "17:00" },
  tuesday: { start_time: "08:00", end_time: "17:00" },
  wednesday: { start_time: "08:00", end_time: "17:00" },
  thursday: { start_time: "08:00", end_time: "17:00" },
  friday: { start_time: "08:00", end_time: "17:00" },
  saturday: { start_time: "08:00", end_time: "17:00" },
});

export const createDefaultFinancesAndTerms = (): TFinancesAndTerms => ({
  bank_name: "",
  bank_account_name: "",
  bank_account_number: "",
  terms_and_conditions: "",
});

export type TVendorServiceDraft = {
  vendor_service_id: string;
  service_id: string;
  is_enabled: boolean;
};

export type TVendorKgPricingDraft = {
  vendor_service_id: string;
  standard_cost_per_kg: number | null;
  express_cost_per_kg: number | null;
  per_kg_weight_threshold?: number | null;
};

export type TVendorItemPricingDraft = {
  vendor_service_id: string;
  item_id: string;
  item_name: string | null;
  standard_price: number | null;
  express_price: number | null;
  pricing_basis_standard?: string | null;
  pricing_basis_express?: string | null;
};

export type TVendorRoomRateDraft = {
  vendor_service_id: string;
  service_room_id: string;
  room_name: string | null;
  regular_cost: number | null;
  deep_cost: number | null;
};

export const hydrateServiceAndPricing = ({
  allServices,
  vendorServices,
  kgPricing,
  itemPricing,
  roomRates,
  forceEnabled,
}: {
  allServices: TService[];
  vendorServices: TVendorServiceDraft[];
  kgPricing: TVendorKgPricingDraft[];
  itemPricing: TVendorItemPricingDraft[];
  roomRates: TVendorRoomRateDraft[];
  forceEnabled?: boolean;
}): TServiceAndPricing => {
  const vendorServiceMap = new Map(
    vendorServices.map((vs) => [vs.service_id, vs])
  );
  const kgMap = new Map(
    kgPricing.map((kg) => [kg.vendor_service_id, kg])
  );
  const itemMap = new Map<string, TVendorItemPricingDraft[]>();
  itemPricing.forEach((ip) => {
    const existing = itemMap.get(ip.vendor_service_id) ?? [];
    existing.push(ip);
    itemMap.set(ip.vendor_service_id, existing);
  });
  const roomMap = new Map<string, TVendorRoomRateDraft[]>();
  roomRates.forEach((rr) => {
    const existing = roomMap.get(rr.vendor_service_id) ?? [];
    existing.push(rr);
    roomMap.set(rr.vendor_service_id, existing);
  });

  return {
    services: allServices.map((service) => {
      const vs = vendorServiceMap.get(service.id);
      const vendorServiceId = vs?.vendor_service_id;
      const kg = vendorServiceId ? kgMap.get(vendorServiceId) : undefined;
      const items = vendorServiceId
        ? (itemMap.get(vendorServiceId) ?? [])
        : [];
      const rooms = vendorServiceId
        ? (roomMap.get(vendorServiceId) ?? [])
        : [];

      return {
        enabled: forceEnabled ? true : (vs?.is_enabled ?? false),
        service_id: service.id,
        service_name: service.name ?? "",
        service_type: (service.service_type ?? "main") as "main" | "other",
        kg_pricing: {
          standard_cost_per_kg: kg?.standard_cost_per_kg ?? 0,
          express_cost_per_kg: kg?.express_cost_per_kg ?? 0,
          per_kg_weight_threshold: kg?.per_kg_weight_threshold ?? 5,
        },
        item_pricing: items.map((ip) => ({
          item_id: ip.item_id,
          item_name: ip.item_name ?? "",
          standard_price: ip.standard_price ?? 0,
          express_price: ip.express_price ?? 0,
          pricing_basis_standard: (ip.pricing_basis_standard ?? "item") as "item" | "per_kg",
          pricing_basis_express: (ip.pricing_basis_express ?? "item") as "item" | "per_kg",
        })),
        room_rates: rooms.map((rr) => ({
          service_room_id: rr.service_room_id,
          room_name: rr.room_name ?? "",
          regular_cost: rr.regular_cost ?? 0,
          deep_cost: rr.deep_cost ?? 0,
        })),
      };
    }),
  };
};
