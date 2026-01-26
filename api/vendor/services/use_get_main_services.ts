import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { Database } from "@/database.types";

export type MainService = Database["public"]["Tables"]["main_services"]["Row"];

/**
 * Fetches all available main services
 */
export const useGetMainServices = () => {
  return useQuery({
    queryKey: ["main_services"],
    queryFn: async (): Promise<MainService[]> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("main_services")
        .select("*")
        .order("service", { ascending: true });

      if (error) throw error;

      return data || [];
    },
  });
};
