"use client";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "../../supabase/client";
import { useVendor } from "@/components/context/vendors/vendor_provider";

export type ChartPeriod = "today" | "week" | "month";

export interface OrderChartDataPoint {
  label: string;
  current_period: number;
  previous_period: number;
}

export interface UseVendorOrdersChartParams {
  period?: ChartPeriod;
}

export const useVendorOrdersChart = ({
  period = "week",
}: UseVendorOrdersChartParams = {}) => {
  const supabase = createSupabaseClient();
  const { vendor } = useVendor();

  return useQuery({
    queryKey: ["vendor", "orders-chart", vendor?.id, period],
    enabled: !!vendor?.id,
    queryFn: async (): Promise<OrderChartDataPoint[]> => {
      if (!vendor?.id) return [];

      const { data, error } = await supabase.rpc("get_vendor_orders_chart", {
        p_vendor_id: vendor.id,
        p_period: period,
      });

      if (error) throw new Error(error.message);
      return (data ?? []) as OrderChartDataPoint[];
    },
  });
};
