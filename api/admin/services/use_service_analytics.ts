"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useServiceAnalytics = () => {
  const supabase = createSupabaseClient();
  return useQuery({
    queryKey: ["service-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_service_analytics");
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    },
    staleTime: 60000,
  });
};
