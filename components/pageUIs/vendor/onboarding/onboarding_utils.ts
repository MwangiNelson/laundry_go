import { locationSchema } from "@/components/schema/shared.schema";
import { Tables } from "@/database.types";
import { z } from "zod";

export const SERVICE_KEYS = [
  "laundry",
  "moving",
  "house_cleaning",
  "office_cleaning",
  "fumigation",
  "dry_cleaning",
] as const;

export type TServiceKey = (typeof SERVICE_KEYS)[number];

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

/** @deprecated Use INDIVIDUAL_STEPS or MULTI_BRANCH_STEPS based on business type */
export const ONBOARDING_STEPS = INDIVIDUAL_STEPS;

export type TOnboardingStepKey =
  | (typeof INDIVIDUAL_STEPS)[number]["key"]
  | (typeof MULTI_BRANCH_STEPS)[number]["key"];

export type TOnboardingStep = { key: TOnboardingStepKey; title: string };

export const getStepsForBusinessType = (
  businessType: "individual" | "multi_branch"
): readonly TOnboardingStep[] =>
  businessType === "multi_branch" ? MULTI_BRANCH_STEPS : INDIVIDUAL_STEPS;

export type TMainService = Tables<"main_services">;

export type TVendorEnabledService = {
  main_service_id: number;
  main_service: Pick<TMainService, "id" | "service" | "slug"> | null;
};

export type TVendorPriceDraftRow = {
  price: number;
  service_item_id: string;
  service_option_id: string | null;
  service_item: {
    id: string;
    name: string;
    main_service_id: number;
  } | null;
  service_option: {
    id: string;
    name: string;
    service_item_id: string;
  } | null;
};

export type TServiceType = {
  id: TServiceKey;
  label: string;
  title: string;
  description: string;
  mainServiceId: number;
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

const getServiceDescription = (
  slug: TServiceKey,
  label: string
): { title: string; description: string } => {
  const descriptions: Record<
    TServiceKey,
    { title: string; description: string }
  > = {
    laundry: {
      title: "Per Kg and Per Item Pricing",
      description:
        "Configure everyday wear, express cleaning, and add custom billable items.",
    },
    moving: {
      title: "Configure Moving Rates",
      description: "Set prices for room sizes, packages, or custom moving jobs.",
    },
    house_cleaning: {
      title: "Setup Cleaning Pricing",
      description:
        "Define standard and deep-clean prices for the spaces you service.",
    },
    office_cleaning: {
      title: "Setup Office Cleaning Pricing",
      description:
        "Define standard and deep-clean prices for your office cleaning services.",
    },
    fumigation: {
      title: "Setup Fumigation Pricing",
      description: "Set base pricing for the areas and packages you cover.",
    },
    dry_cleaning: {
      title: "Setup Dry Cleaning Pricing",
      description:
        "Add dry-cleaning items and define how much each one costs.",
    },
  };

  return (
    descriptions[slug] ?? {
      title: `Setup ${label} Pricing`,
      description: `Configure pricing for ${label.toLowerCase()} services.`,
    }
  );
};

export const convertToServiceTypes = (
  mainServices: TMainService[]
): TServiceType[] =>
  mainServices
    .filter((service) =>
      SERVICE_KEYS.includes(service.slug as TServiceKey)
    )
    .map((service) => {
      const slug = service.slug as TServiceKey;
      const { title, description } = getServiceDescription(
        slug,
        service.service
      );

      return {
        id: slug,
        label: service.service,
        title,
        description,
        mainServiceId: service.id,
      };
    });

const file_value = z
  .union([z.instanceof(File), z.string().url()])
  .optional()
  .nullable();

const business_location = locationSchema
  .nullable()
  .refine((value) => Boolean(value?.description), {
    message: "Please select a business location",
  });

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

const laundry_option = z.object({
  service_option_id: z.string(),
  option_name: z.string(),
  enabled: z.boolean(),
  price: z.number().min(0, "Price must be a positive number"),
});

const laundry_item = z.object({
  service_item_id: z.string().min(1, "Item is required"),
  item_name: z.string(),
  options: z.array(laundry_option),
});

const moving_item = z.object({
  service_item_id: z.string().min(1, "Room or place is required"),
  price: z.number().min(0, "Price must be a positive number"),
});

const cleaning_item = z.object({
  service_item_id: z.string().min(1, "Room or place is required"),
  regular_clean_option_id: z.string().min(1, "Standard option is required"),
  regular_clean_price: z
    .number()
    .min(0, "Standard price must be a positive number"),
  deep_clean_option_id: z.string().min(1, "Deep clean option is required"),
  deep_clean_price: z
    .number()
    .min(0, "Deep clean price must be a positive number"),
});

const fumigation_item = z.object({
  service_item_id: z.string().min(1, "Room or place is required"),
  price: z.number().min(0, "Price must be a positive number"),
});

const dry_cleaning_item = z.object({
  service_item_id: z.string().min(1, "Item is required"),
  price: z.number().min(0, "Price must be a positive number"),
});

const laundry_config = z.object({
  enabled: z.boolean(),
  items: z.array(laundry_item),
});

const moving_config = z.object({
  enabled: z.boolean(),
  items: z.array(moving_item),
});

const cleaning_config = z.object({
  enabled: z.boolean(),
  items: z.array(cleaning_item),
});

const fumigation_config = z.object({
  enabled: z.boolean(),
  items: z.array(fumigation_item),
});

const dry_cleaning_config = z.object({
  enabled: z.boolean(),
  items: z.array(dry_cleaning_item),
});

export const service_and_pricing_base = z.object({
  laundry: laundry_config,
  moving: moving_config,
  house_cleaning: cleaning_config,
  office_cleaning: cleaning_config,
  fumigation: fumigation_config,
  dry_cleaning: dry_cleaning_config,
});

export const service_and_pricing = service_and_pricing_base
  .refine(
    (data) =>
      data.laundry.enabled ||
      data.moving.enabled ||
      data.house_cleaning.enabled ||
      data.office_cleaning.enabled ||
      data.fumigation.enabled ||
      data.dry_cleaning.enabled,
    { message: "Please select at least one service" }
  )
  .refine(
    (data) => {
      const services = [
        data.laundry,
        data.moving,
        data.house_cleaning,
        data.office_cleaning,
        data.fumigation,
        data.dry_cleaning,
      ];

      return services.every((service) => !service.enabled || service.items.length);
    },
    { message: "Each enabled service must have at least one billable item" }
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

export type TLaundryOption = z.infer<typeof laundry_option>;
export type TLaundryItem = z.infer<typeof laundry_item>;
export type TMovingItem = z.infer<typeof moving_item>;
export type TCleaningItem = z.infer<typeof cleaning_item>;
export type TFumigationItem = z.infer<typeof fumigation_item>;
export type TDryCleaningItem = z.infer<typeof dry_cleaning_item>;
export type TBusinessInformation = z.infer<typeof business_information>;
export type TBusinessType = z.infer<typeof business_type>;
export type TServiceAndPricing = z.infer<typeof service_and_pricing_base>;
export type TOperationHours = z.infer<typeof operation_hours>;
export type TFinancesAndTerms = z.infer<typeof finances_and_terms>;

// --- Branch Information (multi-branch flow) ---

const branch_schema = z.object({
  id: z.string().optional(),
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  location: locationSchema
    .nullable()
    .refine((v) => Boolean(v?.description), {
      message: "Please select a branch location",
    }),
  email: z.string().email("Please enter a valid email address"),
});

export const branch_information = z.object({
  branches: z
    .array(branch_schema)
    .min(1, "Please add at least one branch"),
  contact_person: z.string().min(2, "Please enter the contact person name"),
  contact_phone: z.string().min(10, "Please enter a valid phone number"),
  contact_email: z.string().email("Please enter a valid email address"),
});

export type TBranch = z.infer<typeof branch_schema>;
export type TBranchInformation = z.infer<typeof branch_information>;

export const createDefaultBranchInformation = (): TBranchInformation => ({
  branches: [],
  contact_person: "",
  contact_phone: "",
  contact_email: "",
});

export const createEmptyServiceAndPricing = (): TServiceAndPricing => ({
  laundry: { enabled: false, items: [] },
  moving: { enabled: false, items: [] },
  house_cleaning: { enabled: false, items: [] },
  office_cleaning: { enabled: false, items: [] },
  fumigation: { enabled: false, items: [] },
  dry_cleaning: { enabled: false, items: [] },
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

export const hydrateServiceAndPricing = ({
  mainServices,
  enabledServices,
  vendorPrices,
}: {
  mainServices: TMainService[];
  enabledServices: TVendorEnabledService[];
  vendorPrices: TVendorPriceDraftRow[];
}): TServiceAndPricing => {
  const draft = createEmptyServiceAndPricing();
  const serviceIdToKey = new Map(
    mainServices.map((service) => [service.id, service.slug as TServiceKey])
  );
  const laundryItems = new Map<string, TLaundryItem>();
  const movingItems = new Map<string, TMovingItem>();
  const dryCleaningItems = new Map<string, TDryCleaningItem>();
  const fumigationItems = new Map<string, TFumigationItem>();
  const cleaningItems = new Map<string, TCleaningItem>();

  enabledServices.forEach((service) => {
    const serviceKey =
      (service.main_service?.slug as TServiceKey | undefined) ??
      serviceIdToKey.get(service.main_service_id);

    if (serviceKey) {
      draft[serviceKey].enabled = true;
    }
  });

  vendorPrices.forEach((priceRow) => {
    const serviceKey = priceRow.service_item
      ? serviceIdToKey.get(priceRow.service_item.main_service_id)
      : undefined;

    if (!serviceKey || !priceRow.service_item) {
      return;
    }

    draft[serviceKey].enabled = true;

    if (serviceKey === "laundry") {
      const existingLaundryItem = laundryItems.get(priceRow.service_item_id);

      if (existingLaundryItem) {
        existingLaundryItem.options.push({
          service_option_id: priceRow.service_option_id ?? "",
          option_name: priceRow.service_option?.name ?? "",
          enabled: true,
          price: priceRow.price,
        });
      } else {
        laundryItems.set(priceRow.service_item_id, {
          service_item_id: priceRow.service_item_id,
          item_name: priceRow.service_item.name,
          options: [
            {
              service_option_id: priceRow.service_option_id ?? "",
              option_name: priceRow.service_option?.name ?? "",
              enabled: true,
              price: priceRow.price,
            },
          ],
        });
      }

      return;
    }

    if (serviceKey === "moving") {
      movingItems.set(priceRow.service_item_id, {
        service_item_id: priceRow.service_item_id,
        price: priceRow.price,
      });
      return;
    }

    if (serviceKey === "fumigation") {
      fumigationItems.set(priceRow.service_item_id, {
        service_item_id: priceRow.service_item_id,
        price: priceRow.price,
      });
      return;
    }

    if (serviceKey === "dry_cleaning") {
      dryCleaningItems.set(priceRow.service_item_id, {
        service_item_id: priceRow.service_item_id,
        price: priceRow.price,
      });
      return;
    }

    if (
      serviceKey === "house_cleaning" ||
      serviceKey === "office_cleaning"
    ) {
      const cleaningMapKey = `${serviceKey}:${priceRow.service_item_id}`;
      const existingCleaningItem = cleaningItems.get(cleaningMapKey) ?? {
        service_item_id: priceRow.service_item_id,
        regular_clean_option_id: "",
        regular_clean_price: 0,
        deep_clean_option_id: "",
        deep_clean_price: 0,
      };
      const optionName = priceRow.service_option?.name.toLowerCase() ?? "";

      if (optionName.includes("deep")) {
        existingCleaningItem.deep_clean_option_id =
          priceRow.service_option_id ?? "";
        existingCleaningItem.deep_clean_price = priceRow.price;
      } else {
        existingCleaningItem.regular_clean_option_id =
          priceRow.service_option_id ?? "";
        existingCleaningItem.regular_clean_price = priceRow.price;
      }

      cleaningItems.set(cleaningMapKey, existingCleaningItem);
    }
  });

  draft.laundry.items = Array.from(laundryItems.values());
  draft.moving.items = Array.from(movingItems.values());
  draft.fumigation.items = Array.from(fumigationItems.values());
  draft.dry_cleaning.items = Array.from(dryCleaningItems.values());
  draft.house_cleaning.items = Array.from(cleaningItems.entries())
    .filter(([key]) => key.startsWith("house_cleaning:"))
    .map(([, value]) => value);
  draft.office_cleaning.items = Array.from(cleaningItems.entries())
    .filter(([key]) => key.startsWith("office_cleaning:"))
    .map(([, value]) => value);

  return draft;
};
