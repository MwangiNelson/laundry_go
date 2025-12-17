import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

type IParams = {
  vendor_id: string;
  search?: string;
  page?: number;
  page_size?: number;
  main_service_id?: number;
  service_item_id?: string;
};

export type ServiceItem = {
  id: string;
  name: string;
  type: string;
  icon_path: string | null;
  main_service_id: number;
};

export type ServiceOption = {
  id: string;
  name: string;
  description: string | null;
  service_item_id: string;
};

export type MainService = {
  id: number;
  service: string;
  slug: string;
};

export type VendorService = {
  id: string;
  vendor_id: string;
  service_item_id: string;
  service_option_id: string | null;
  price: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  service_item: ServiceItem;
  service_option: ServiceOption | null;
  main_service: MainService;
};

type FetchServicesResponse = {
  data: VendorService[];
  total_count: number;
  has_next: boolean;
};

export const useFetchServices = (params: IParams) => {
  return useQuery({
    queryKey: ["vendor_services", params],
    queryFn: async (): Promise<FetchServicesResponse> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("fetch_vendor_services", {
        p_vendor_id: params.vendor_id,
        p_search: params.search,
        p_page: params.page || 1,
        p_page_size: params.page_size || 10,
        p_main_service_id: params.main_service_id,
        p_service_item_id: params.service_item_id,
      });

      if (error) {
        throw new Error(error.message);
      }

      // The function returns an array with one row containing data, total_count, has_next
      const result = (data as unknown as unknown[])?.[0] as unknown as
        | { data: VendorService[]; total_count: number; has_next: boolean }
        | undefined;

      return {
        data: result?.data || [],
        total_count: result?.total_count || 0,
        has_next: result?.has_next || false,
      };
    },
    enabled: !!params.vendor_id,
  });
};
