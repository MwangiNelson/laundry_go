import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { Tables } from "@/database.types";

export type Item = Tables<"items">;

/**
 * Fetches all available items from the items catalog.
 * Items are global and not scoped to a service.
 */
export const useGetAllItems = () => {
  return useQuery({
    queryKey: ["all_items"],
    queryFn: async (): Promise<Item[]> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      return data || [];
    },
  });
};
