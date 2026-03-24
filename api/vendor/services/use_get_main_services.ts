import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { Tables } from "@/database.types";

export type Service = Tables<"services">;

/**
 * Fetches all available services from the services table
 */
export const useGetMainServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      return data || [];
    },
  });
};
