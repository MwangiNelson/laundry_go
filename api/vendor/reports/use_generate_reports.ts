"use client";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { useVendor } from "@/components/context/vendors/vendor_provider";

interface UseGenerateOrdersReportsParams {
  startDate?: Date;
  endDate?: Date;
}

export const useGenerateOrdersReports = ({
  startDate,
  endDate,
}: UseGenerateOrdersReportsParams = {}) => {
  const supabase = createSupabaseClient();
  const { vendor } = useVendor();
  return useQuery({
    queryKey: [
      "reports",
      "orders",
      vendor?.id,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    enabled: !!vendor?.id,
    queryFn: async () => {
      if (!vendor?.id) return null;
      const { data, error } = await supabase.rpc("get_orders_report_sheet", {
        p_vendor_id: vendor.id,
        p_start_date: startDate ? startDate.toISOString() : null,
        p_end_date: endDate ? endDate.toISOString() : null,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
