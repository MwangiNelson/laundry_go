"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useFetchServicesAdmin = () => {
  return useQuery({
    queryKey: ["admin_services"],
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from("main_services").select(`*,
        service_items (*,
          service_options (*)
        )
        `);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
