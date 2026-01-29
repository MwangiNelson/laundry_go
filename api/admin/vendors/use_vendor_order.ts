"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface IVendorOrderParams {
  vendor_id: string;
  status?: string;
  main_service_slug?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface IVendorOrder {
  id: string;
  status: string;
  total_price: number;
  payment_status: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  pickup_details: any;
  delivery_details: any;
  main_service: {
    id: number;
    service: string;
    slug: string;
  };
  customer: {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  order_items: Array<{
    id: string;
    quantity: number;
    price: number | null;
    name: string | null;
    service_item: {
      id: string;
      name: string;
      icon_path: string | null;
    };
    service_option: {
      id: string;
      name: string;
      description: string | null;
    } | null;
  }>;
  items_count: number;
  total_quantity: number;
}

export interface IVendorOrdersResponse {
  data: IVendorOrder[];
  has_next: boolean;
  total_count: number;
  page: number;
  page_size: number;
}

export const useFetchVendorOrders = (params: IVendorOrderParams) => {
  return useQuery({
    queryKey: ["vendor-orders", params],
    queryFn: async (): Promise<IVendorOrdersResponse> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_orders", {
        p_vendor_id: params.vendor_id,
        p_status: params.status ?? undefined,
        p_main_service_slug: params.main_service_slug ?? undefined,
        p_page: params.page ?? 1,
        p_page_size: params.page_size ?? 10,
        p_sort_by: params.sort_by ?? "created_at",
        p_sort_order: params.sort_order ?? "DESC",
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from get_orders");
      }

      return data as unknown as IVendorOrdersResponse;
    },
    enabled: !!params.vendor_id,
  });
};
