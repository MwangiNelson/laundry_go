import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

type IParams = {
  vendor_id: string;
  search?: string;
  page?: number;
  size?: number;
  status?: string;
};

type RiderUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  role: string;
};

export type Rider = {
  id: string;
  vendor_id: string;
  user_id: string;
  id_number: string;
  assigned_vehicle: string;
  vehicle_plate: string;
  status: string;
  notes: string | null;
  in_process_orders: number;
  total_deliveries: number;
  created_at: string;
  updated_at: string;
  user: RiderUser;
};

type FetchRidersResponse = {
  data: Rider[];
  total_count: number;
  has_next: boolean;
};

export const useFetchRiders = (params: IParams) => {
  return useQuery({
    queryKey: ["riders", params],
    queryFn: async (): Promise<FetchRidersResponse> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("fetch_riders", {
        p_vendor_id: params.vendor_id,
        p_search: params.search,
        p_page: params.page || 1,
        p_size: params.size || 10,
        p_status: params.status,
      });

      if (error) {
        throw new Error(error.message);
      }

      // The function returns an array with one row containing data, total_count, has_next
      const result = data?.[0] as
        | { data: Rider[]; total_count: number; has_next: boolean }
        | undefined;

      return {
        data: result?.data || [],
        total_count: result?.total_count || 0,
        has_next: result?.has_next || false,
      };
    },
  });
};

///fe
