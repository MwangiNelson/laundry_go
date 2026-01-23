"use server";

import { createSupabaseServer } from "@/api/supabase/server";

export const updateRider = async ({
  rider_id,
  user_id,
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
  rider_id: string;
  user_id: string;
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
    // Step 1: Update profile (user info)
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        phone: phone,
        email: email,
        ...(avatar_url && { avatar_url }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user_id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    // Step 2: Update rider record
    const { data: rider, error: riderError } = await supabase
      .from("riders")
      .update({
        id_number: license,
        assigned_vehicle: vehicle,
        vehicle_plate: vehiclePlate,
        notes: notes || null,
        status: status || "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", rider_id)
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
    console.error("Error updating rider:", error);
    return {
      data: null,
      error: (error as Error).message ?? "An unexpected error occurred",
    };
  }
};

