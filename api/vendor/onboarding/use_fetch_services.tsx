"use client";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "../../supabase/client";

export interface ServiceItem {
  id: string;
  name: string;
  type: "item" | "area";
  main_service_id: number;
}

export interface ServiceOption {
  id: string;
  name: string;
  service_item_id: string;
}

export interface MainService {
  id: number;
  service: string;
  items: ServiceItem[];
}

export interface ServiceItemWithOptions extends ServiceItem {
  options: ServiceOption[];
}

// Fetch all main services
export const useFetchMainServices = () => {
  return useQuery({
    queryKey: ["main_services"],
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("main_services")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch service items for a specific main service
export const useFetchServiceItems = (mainServiceId: number | null) => {
  return useQuery({
    queryKey: ["service_items", mainServiceId],
    queryFn: async () => {
      if (!mainServiceId) return [];

      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("service_items")
        .select("*")
        .eq("main_service_id", mainServiceId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!mainServiceId,
  });
};

export const useFetchServiceOptions = (serviceItemId: string | null) => {
  return useQuery({
    queryKey: ["service_options", serviceItemId],
    queryFn: async () => {
      if (!serviceItemId) return [];

      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("service_options")
        .select("*")
        .eq("service_item_id", serviceItemId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!serviceItemId,
  });
};

export const useFetchServiceItemsWithOptions = (
  mainServiceId: number | null
) => {
  return useQuery({
    queryKey: ["service_items_with_options", mainServiceId],
    queryFn: async () => {
      if (!mainServiceId) return [];

      const supabase = createSupabaseClient();

      const { data: items, error: itemsError } = await supabase
        .from("service_items")
        .select("*")
        .eq("main_service_id", mainServiceId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (itemsError) throw itemsError;

      const itemsWithOptions = await Promise.all(
        (items || []).map(async (item) => {
          const { data: options, error: optionsError } = await supabase
            .from("service_options")
            .select("*")
            .eq("service_item_id", item.id)
            .eq("is_active", true)
            .order("display_order", { ascending: true });

          if (optionsError) throw optionsError;

          return {
            ...item,
            options: options || [],
          } as ServiceItemWithOptions;
        })
      );

      return itemsWithOptions;
    },
    enabled: !!mainServiceId,
  });
};
