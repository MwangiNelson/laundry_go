import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export interface IServiceOption {
  id: string;
  service_item_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
}

export interface IFetchServiceOptionsParams {
  service_item_id?: string;
}

export const useFetchServiceOptions = (params?: IFetchServiceOptionsParams) => {
  return useQuery({
    queryKey: ["service-options", params],
    queryFn: async (): Promise<IServiceOption[]> => {
      const supabase = createSupabaseClient();

      let query = supabase
        .from("service_options")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (params?.service_item_id) {
        query = query.eq("service_item_id", params.service_item_id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []) as unknown as IServiceOption[];
    },
  });
};
