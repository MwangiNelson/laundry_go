import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export interface IServiceItem {
  id: string;
  name: string;
  type: string;
  main_service_id: number;
  icon_path: string | null;
  is_active: boolean;
  display_order: number;
}

export interface IFetchServiceItemsParams {
  main_service_id?: number;
}

export const useFetchServiceItems = (params?: IFetchServiceItemsParams) => {
  return useQuery({
    queryKey: ["service-items", params],
    queryFn: async (): Promise<IServiceItem[]> => {
      const supabase = createSupabaseClient();

      let query = supabase
        .from("service_items")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (params?.main_service_id) {
        query = query.eq("main_service_id", params.main_service_id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []) as unknown as IServiceItem[];
    },
  });
};
