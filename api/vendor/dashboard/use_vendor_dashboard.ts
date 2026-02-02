"use client";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "../../supabase/client";
import { useVendor } from "@/components/context/vendors/vendor_provider";

export type ChartPeriod = "today" | "week" | "month";
export type DashboardPeriod = "month" | "year" | "all";

export interface VendorDashboardStats {
  new_orders: number;
  in_progress_orders: number;
  ready_for_delivery: number;
  total_orders: number;
  total_revenue: number;
  prev_new_orders: number;
  prev_in_progress_orders: number;
  prev_ready_for_delivery: number;
  prev_total_orders: number;
  prev_total_revenue: number;
}

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

export interface UseVendorDashboardStatsParams {
  period?: DashboardPeriod;
}

export const useVendorDashboardStats = ({
  period = "month",
}: UseVendorDashboardStatsParams = {}) => {
  const supabase = createSupabaseClient();
  const { vendor } = useVendor();

  return useQuery({
    queryKey: ["vendor", "dashboard", "stats", vendor?.id, period],
    enabled: !!vendor?.id,
    queryFn: async (): Promise<VendorDashboardStats | null> => {
      if (!vendor?.id) return null;

      const { data, error } = await supabase.rpc("get_vendor_dashboard_stats", {
        p_vendor_id: vendor.id,
        p_period: period,
      });

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return null;

      const row = data[0] as Record<string, unknown>;
      return {
        new_orders: Number(row.new_orders ?? 0),
        in_progress_orders: Number(row.in_progress_orders ?? 0),
        ready_for_delivery: Number(row.ready_for_delivery ?? 0),
        total_orders: Number(row.total_orders ?? 0),
        total_revenue: Number(row.total_revenue ?? 0),
        prev_new_orders: Number(row.prev_new_orders ?? 0),
        prev_in_progress_orders: Number(row.prev_in_progress_orders ?? 0),
        prev_ready_for_delivery: Number(row.prev_ready_for_delivery ?? 0),
        prev_total_orders: Number(row.prev_total_orders ?? 0),
        prev_total_revenue: Number(row.prev_total_revenue ?? 0),
      };
    },
  });
};

/**
 * Calculate percentage change between current and previous values
 */
export const calcPercentageChange = (
  current: number | undefined,
  previous: number | undefined
): string | undefined => {
  const curr = current ?? 0;
  const prev = previous ?? 0;

  if (prev === 0) {
    return curr > 0 ? "+100%" : undefined;
  }

  const change = ((curr - prev) / prev) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};
