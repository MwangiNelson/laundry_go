"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/database.types";
import type { ICustomer } from "@/components/tables/admin/customers/customers.column";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface ICustomerParams {
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface IFetchCustomersResponse {
  data: ICustomer[];
  has_next: boolean;
  page_count: number;
  page: number;
  page_size: number;
}

export interface ICustomerStats {
  total_customers: number;
  total_orders: number;
  active_accounts: number;
  suspended: number;
}

export const useFetchCustomerStats = () => {
  return useQuery({
    queryKey: ["customers", "stats"],
    queryFn: async (): Promise<ICustomerStats> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_customer_stats");

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from get_customer_stats");
      }

      return data as unknown as ICustomerStats;
    },
  });
};

export const useFetchCustomers = (params: ICustomerParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: async (): Promise<IFetchCustomersResponse> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_customers", {
        p_status: params.status ?? undefined,
        p_search: params.search ?? undefined,
        p_page: params.page ?? 1,
        p_page_size: params.page_size ?? 10,
        p_sort_by: params.sort_by ?? "created_at",
        p_sort_order: params.sort_order ?? "DESC",
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from get_customers");
      }

      return data as unknown as IFetchCustomersResponse;
    },
  });
};

export const useFetchCustomerById = (customerId: string | null) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", customerId!)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No customer found");
      }

      return data as ProfileRow;
    },
    enabled: !!customerId,
  });
};

export interface ICustomerOrderParams {
  customer_id: string;
  status?: string;
  main_service_slug?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface ICustomerOrdersResponse {
  data: Array<{
    id: string;
    service: string;
    order_items: string;
    payment_status: string;
    created_at: string;
    status: string;
  }>;
  has_next: boolean;
  total_count: number;
  page: number;
  page_size: number;
}

export const useFetchCustomerOrders = (params: ICustomerOrderParams) => {
  return useQuery({
    queryKey: ["customer-orders", params],
    queryFn: async (): Promise<ICustomerOrdersResponse> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_customer_orders", {
        p_customer_id: params.customer_id,
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
        throw new Error("No data returned from get_customer_orders");
      }

      return data as unknown as ICustomerOrdersResponse;
    },
    enabled: !!params.customer_id,
  });
};

export interface ICustomerOrderStats {
  total_orders: number;
  total_spent: number;
  total_refunds: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

export const useFetchCustomerOrderStats = (customerId: string | null) => {
  return useQuery({
    queryKey: ["customer-order-stats", customerId],
    queryFn: async (): Promise<ICustomerOrderStats> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_customer_order_stats", {
        //@ts-ignore
        p_customer_id: customerId ?? undefined,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from get_customer_order_stats");
      }

      return data as unknown as ICustomerOrderStats;
    },
    enabled: !!customerId,
  });
};

export const useFetchCustomerReviews = (customerId: string | null) => {
  return useQuery({
    queryKey: ["customer-reviews", customerId],
    queryFn: async () => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          vendor:vendors(
            id,
            business_name,
            logo_url
          )
        `)
        .eq("customer_id", customerId!)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No reviews found");
      }
      return data;
    },
    enabled: !!customerId,
  });
};
