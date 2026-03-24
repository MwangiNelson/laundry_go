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
