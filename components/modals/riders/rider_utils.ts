import { z } from "zod";
export const create_rider_schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  license: z.string().min(1, "License is required"),
  vehicle: z.string().min(1, "Vehicle type is required"),
  vehiclePlate: z.string().min(1, "Vehicle plate is required"),
  profilePhoto: z
    .instanceof(File, { message: "Profile photo is required" })
    .optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

export type ICreateRiderFormData = z.infer<typeof create_rider_schema>;
