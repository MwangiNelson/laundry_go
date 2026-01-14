import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { useVendor } from "@/components/context/vendors/vendor_provider";

type ServiceOption = {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  price: number;
  is_available: boolean;
  notes: string | null;
  vendor_price_id?: string; // ID from vendor_prices table
};

type ServiceItem = {
  id: string;
  name: string;
  type: string;
  icon_path: string | null;
  display_order: number;
  is_available: boolean;
  price: number | null;
  options: ServiceOption[];
  vendor_price_id?: string; // ID from vendor_prices table for items without options
};

export type VendorServiceData = {
  main_service_id: number;
  main_service_name: string;
  main_service_slug: string;
  service_items: ServiceItem[];
};

export const useGetVendorServices = () => {
  const { vendor } = useVendor();
  return useQuery({
    queryKey: ["get_vendor_services", vendor?.id],
    queryFn: async (): Promise<VendorServiceData[]> => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase.rpc("get_vendor_services", {
        p_vendor_id: vendor?.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      return (data as VendorServiceData[]) || [];
    },
    enabled: !!vendor?.id,
  });
};
