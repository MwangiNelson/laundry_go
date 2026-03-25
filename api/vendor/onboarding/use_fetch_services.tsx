"use client";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "../../supabase/client";

// Fetch all services from the `services` table
export const useFetchServices = () => {
  return useQuery({
    queryKey: ["services"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch all items from the `items` table
export const useFetchItems = () => {
  return useQuery({
    queryKey: ["items"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch the service IDs that a parent vendor has enabled
export const useFetchParentVendorServiceIds = (
  parentVendorId: string | null | undefined
) => {
  return useQuery({
    queryKey: ["parent-vendor-services", parentVendorId],
    enabled: !!parentVendorId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_services")
        .select("service_id")
        .eq("vendor_id", parentVendorId!)
        .eq("is_enabled", true);

      if (error) throw error;
      return (data ?? []).map((vs) => vs.service_id);
    },
  });
};

// Fetch all service rooms (room types for "other" services)
export type TServiceRoom = { id: string; name: string };

export const useFetchServiceRooms = () => {
  return useQuery({
    queryKey: ["service_rooms"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("service_rooms")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;
      return (data ?? []).filter(
        (r): r is TServiceRoom => r.name !== null
      );
    },
  });
};
