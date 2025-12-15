"use server";

import { createSupabaseServer } from "@/api/supabase/server";
import { createUser } from "./create_user";

export const createRider = async ({
  vendor_id,
  name,
  phone,
  email,
  license,
  vehicle,
  vehiclePlate,
  avatar_url,
  notes,
  status,
}: {
  vendor_id: string;
  name: string;
  phone: string;
  email: string;
  license: string;
  vehicle: string;
  vehiclePlate: string;
  avatar_url?: string;
  notes?: string;
  status?: string;
}) => {
  const supabase = await createSupabaseServer();

  try {
    const userResult = await createUser({
      email: email,
      phone,
      full_name: name,
      password: "rider123",
    });

    if (userResult.error) {
      throw new Error(userResult.error);
    }

    const userId = userResult.data?.user?.id;
    if (!userId) {
      throw new Error("Failed to create user account");
    }

    // Step 2: Update profile with avatar URL if provided
    if (avatar_url) {
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          avatar_url,
          role: "driver",
        })
        .eq("id", userId);

      if (updateProfileError) {
        console.error("Error updating profile avatar:", updateProfileError);
      }
    } else {
      // Just set role to driver
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ role: "driver" })
        .eq("id", userId);

      if (updateProfileError) {
        console.error("Error updating profile role:", updateProfileError);
      }
    }

    // Step 3: Insert rider record with user_id link
    const { data: rider, error: riderError } = await supabase
      .from("riders")
      .insert({
        vendor_id,
        user_id: userId,
        id_number: license,
        assigned_vehicle: vehicle,
        vehicle_plate: vehiclePlate,
        notes: notes || null,
        status: status || "active",
      })
      .select(
        `
        *,
        user:profiles!riders_user_id_fkey(
          id,
          full_name,
          email,
          phone,
          avatar_url
        )
      `
      )
      .single();

    if (riderError) {
      throw new Error(riderError.message);
    }

    return {
      data: rider,
      error: null,
    };
  } catch (error) {
    console.error("Error creating rider:", error);
    return {
      data: null,
      error: (error as Error).message ?? "An unexpected error occurred",
    };
  }
};
