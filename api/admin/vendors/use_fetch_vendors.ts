"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface IVendorStats {
  under_review: number;
  onboarded: number;
  active: number;
  suspended: number;
}

export interface IVendorParams {
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface IVendorAdmin {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

export type IVendorStatus =
  | "under_review"
  | "active"
  | "suspended"
  | "rejected"
  | "onboarded"
  | "pending";

export interface IVendorService {
  id: number;
  service: string;
  slug: string;
}

export interface IVendor {
  id: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  profile_complete: boolean | null;
  admin: IVendorAdmin;
  services: IVendorService[];
}

export interface IFetchVendorsResponse {
  data: IVendor[];
  has_next: boolean;
  total_count: number;
  page: number;
  page_size: number;
}

export const useFetchVendorStats = () => {
  return useQuery({
    queryKey: ["vendos", "stats"],
    queryFn: async (): Promise<IVendorStats> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_vendor_stats");

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No data returned from get_vendor_stats");
      }

      return data as unknown as IVendorStats;
    },
  });
};

export const useFetchVendors = (params: IVendorParams) => {
  return useQuery({
    queryKey: ["vendors", params],
    queryFn: async (): Promise<IFetchVendorsResponse> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_vendors", {
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
        throw new Error("No data returned from get_vendors");
      }

      return data as unknown as IFetchVendorsResponse;
    },
  });
};

export interface IVendorForModal {
  id: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  profile_complete: boolean | null;
  last_active: string | null;
  admin: IVendorAdmin;
  services: IVendorService[];
}

export const useFetchVendorById = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async (): Promise<IVendorForModal> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("vendors")
        .select(
          `
          *
        `
        )
        .eq("id", vendorId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No vendor found");
      }

      return data as unknown as IVendorForModal;
    },
    enabled: !!vendorId,
  });
};

// Fetch vendor main services
export interface IVendorMainService {
  main_service_id: number;
  main_service_name: string;
  main_service_slug: string;
  service_items: any;
}

export const useFetchVendorMainServices = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor", vendorId, "main-services"],
    queryFn: async (): Promise<IVendorMainService[]> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_vendor_services", {
        p_vendor_id: vendorId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!vendorId,
  });
};

// Fetch vendor service prices
export interface IVendorServicePrice {
  service_name: string;
  price: number;
}

export const useFetchVendorServicePrices = (
  vendorId: string,
  mainServiceId: number
) => {
  return useQuery({
    queryKey: ["vendor", vendorId, "service-prices", mainServiceId],
    queryFn: async (): Promise<IVendorServicePrice[]> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_vendor_service_prices", {
        p_vendor_id: vendorId,
        p_main_service_id: mainServiceId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!vendorId && !!mainServiceId,
  });
};

// Fetch vendor reviews
export const useFetchVendorReviews = (vendorId: string | null) => {
  return useQuery({
    queryKey: ["vendor-reviews", vendorId],
    queryFn: async () => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          customer:profiles!reviews_customer_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          )
        `
        )
        .eq("vendor_id", vendorId!)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No reviews found");
      }
      return data;
    },
    enabled: !!vendorId,
  });
};
