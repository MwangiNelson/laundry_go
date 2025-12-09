import { z } from "zod";
export const SERVICE_NAME_TO_ID: Record<string, number> = {
  laundry: 1,
  moving: 2,
  office_cleaning: 3,
  fumigation: 4,
  house_cleaning: 5,
};

// Helper to convert service name to slug
const toSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "_");
};

// Helper to generate service descriptions
const getServiceDescription = (
  serviceName: string
): { title: string; description: string } => {
  const slug = toSlug(serviceName);

  const descriptions: Record<string, { title: string; description: string }> = {
    laundry: {
      title: "Add New Laundry Item",
      description:
        "Configure the pricing method and category for clothing items.",
    },
    moving: {
      title: "Configure Moving Estimates",
      description: "Set your base rates per room type.",
    },
    house_cleaning: {
      title: "Setup Cleaning Pricing",
      description:
        "Define your standard rates for different cleaning intensities and room sizes.",
    },
    office_cleaning: {
      title: "Setup Cleaning Pricing",
      description:
        "Define your standard rates for different cleaning intensities and room sizes.",
    },
    fumigation: {
      title: "Setup Fumigation Pricing",
      description: "Define your standard rates for pest control services.",
    },
  };

  return (
    descriptions[slug] || {
      title: `Setup ${serviceName} Pricing`,
      description: `Configure pricing for ${serviceName.toLowerCase()} services.`,
    }
  );
};

// Convert database main_services to SERVICE_TYPES format
export const convertToServiceTypes = (
  mainServices: { id: number; service: string }[]
) => {
  return mainServices.map((service) => {
    const slug = toSlug(service.service);
    const { title, description } = getServiceDescription(service.service);

    return {
      id: slug,
      label: service.service,
      title,
      description,
      mainServiceId: service.id,
    };
  });
};

export const business_information = z.object({
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Please enter a valid address"),
  logo: z.instanceof(File).optional(),
  business_lincense: z.instanceof(File).optional(),
});
const laundry_item = z.object({
  service_item_id: z.string().min(1, "Item is required"),
  service_option_id: z.string().min(1, "Service option is required"),
  price: z.number().min(0, "Price must be a positive number"),
});
const moving_item = z.object({
  service_item_id: z.string().min(1, "Room/Place is required"),
  price: z.number().min(0, "Price must be a positive number"),
});
const cleaning_item = z.object({
  service_item_id: z.string().min(1, "Room/Place is required"),
  regular_clean_option_id: z.string().min(1, "Regular clean option required"),
  regular_clean_price: z
    .number()
    .min(0, "Regular clean price must be a positive number"),
  deep_clean_option_id: z.string().min(1, "Deep clean option required"),
  deep_clean_price: z
    .number()
    .min(0, "Deep clean price must be a positive number"),
});
const fumigation_item = z.object({
  service_item_id: z.string().min(1, "Room/Place is required"),
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

// Base schema for type inference (without refine)
const service_and_pricing_base = z.object({
  laundry: laundry_config,
  moving: moving_config,
  house_cleaning: cleaning_config,
  office_cleaning: cleaning_config,
  fumigation: fumigation_config,
});

// Full schema with validation refinements
export const service_and_pricing = service_and_pricing_base
  .refine(
    (data) =>
      data.laundry.enabled ||
      data.moving.enabled ||
      data.house_cleaning.enabled ||
      data.office_cleaning.enabled ||
      data.fumigation.enabled,
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
      ];
      return services.every((s) => !s.enabled || s.items.length > 0);
    },
    { message: "Each enabled service must have at least one item" }
  );

// Use base schema for type (avoids refine type issues with react-hook-form)
export type TServiceAndPricing = z.infer<typeof service_and_pricing_base>;
export type TOnboardingFormData = {
  business_information: TBusinessInformation;
  operation_hours: TOperationHours;
  service_and_pricing: TServiceAndPricing;
  admin_user_id?: string;
};

export const day_hours = z
  .object({
    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  })
  .optional();

export const operation_hours = z.object({
  sunday: day_hours,
  monday: day_hours,
  tuesday: day_hours,
  wednesday: day_hours,
  thursday: day_hours,
  friday: day_hours,
  saturday: day_hours,
});

export type TOperationHours = z.infer<typeof operation_hours>;
export type TBusinessInformation = z.infer<typeof business_information>;
