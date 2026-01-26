import { z } from "zod";

// Business Profile Schema
export const business_profile_schema = z.object({
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  phone_number: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  logo: z.instanceof(File).optional(),
});

export type TBusinessProfile = z.infer<typeof business_profile_schema>;

// Operating Hours Schema
const day_hours = z
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

export const operating_hours_schema = z.object({
  sunday: day_hours,
  monday: day_hours,
  tuesday: day_hours,
  wednesday: day_hours,
  thursday: day_hours,
  friday: day_hours,
  saturday: day_hours,
});

export type TOperatingHours = z.infer<typeof operating_hours_schema>;

// Payout Methods Schema
export const payout_methods_schema = z.object({
  bank_name: z.string().min(1, "Bank name is required"),
  account_name: z.string().min(1, "Account name is required"),
  account_number: z.string().min(1, "Account number is required"),
});

export type TPayoutMethods = z.infer<typeof payout_methods_schema>;

// Security & Account Schema
export const security_account_schema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type TSecurityAccount = z.infer<typeof security_account_schema>;

// Days configuration
export const DAYS = [
  { key: "sunday", label: "Sun" },
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
] as const;

export type DayKey = (typeof DAYS)[number]["key"];
