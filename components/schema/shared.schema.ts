import { z } from "zod";
export const locationSchema = z.object({
  place_id: z
    .string({
      message: "Google Maps Place ID for the location",
    })
    .optional(),
  description: z
    .string({
      message: "Full address of the location",
    })
    .nullable(),
  main_text: z
    .string({
      message: "Primary location name",
    })
    .optional(),
  secondary_text: z
    .string({
      message: "Additional location details",
    })
    .optional(),
  coordinates: z
    .object({
      lat: z.number({
        message: "Latitude coordinate",
      }),
      lng: z.number({
        message: "Longitude coordinate",
      }),
    })
    .optional(),
});
