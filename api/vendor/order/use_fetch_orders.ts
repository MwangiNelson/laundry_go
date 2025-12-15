import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export interface IOrderParams {
  status?: string;
  main_service_slug?: string;
  search?: string;
  page?: number;
  page_size?: number;
  rider_id?: string;
  vendor_id?: string;
  service_item_id?: string;
  service_option_id?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface IPickupDetails {
  type?: string;
  location?: string;
  service_category?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface IDeliveryDetails {
  location?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface IOrderCustomer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface IOrderVendor {
  id: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  logo_url: string | null;
  status: string;
}

export interface IOrderRider {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string;
  avatar_url: string | null;
  assigned_vehicle: string;
  vehicle_plate: string;
  status: string;
}

export interface IServiceItem {
  id: string;
  name: string;
  type: string;
  icon_path: string | null;
}

export interface IServiceOption {
  id: string;
  name: string;
  description: string | null;
}

export interface IOrderItem {
  id: string;
  quantity: number;
  price: number;
  service_item: IServiceItem;
  service_option: IServiceOption | null;
}

export interface IMainService {
  id: number;
  service: string;
  slug: string;
}
export type IOrderStatus =
  | "New"
  | "Confirmed"
  | "Ongoing"
  | "Ready"
  | "Delivered"
  | "Completed"
  | "Rated"
  | "Cancelled"
  | "Scheduled"
  | "Draft";

export interface IOrder {
  id: string;
  status: IOrderStatus;
  total_price: number;
  payment_status: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  pickup_details: IPickupDetails | null;
  delivery_details: IDeliveryDetails | null;
  main_service: IMainService;
  customer: IOrderCustomer;
  vendor: IOrderVendor;
  rider: IOrderRider | null;
  order_items: IOrderItem[];
  items_count: number;
  total_quantity: number;
}

export interface IFetchOrdersResponse {
  data: IOrder[];
  has_next: boolean;
  total_count: number;
  page: number;
  page_size: number;
}

export const useFetchOrders = (params: IOrderParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async (): Promise<IFetchOrdersResponse> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_orders", {
        p_status: params.status ?? undefined,
        p_main_service_slug: params.main_service_slug ?? undefined,
        p_search: params.search ?? undefined,
        p_page: params.page ?? 1,
        p_page_size: params.page_size ?? 10,
        p_rider_id: params.rider_id ?? undefined,
        p_vendor_id: params.vendor_id ?? undefined,
        p_service_item_id: params.service_item_id ?? undefined,
        p_service_option_id: params.service_option_id ?? undefined,
        p_sort_by: params.sort_by ?? "created_at",
        p_sort_order: params.sort_order ?? "DESC",
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from get_orders");
      }

      return data as unknown as IFetchOrdersResponse;
    },
    enabled: !!params.vendor_id || !!params.main_service_slug,
  });
};
