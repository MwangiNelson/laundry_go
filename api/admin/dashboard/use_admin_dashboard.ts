"use client";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export type DashboardPeriod = "month" | "year" | "all";

export interface AdminDashboardStats {
  total_laundry_marts: number;
  active_laundry_marts: number;
  total_orders: number;
  total_revenue: number;
  pending_payouts: number;
  prev_total_laundry_marts: number;
  prev_active_laundry_marts: number;
  prev_total_orders: number;
  prev_total_revenue: number;
  prev_pending_payouts: number;
}

export interface UseAdminDashboardStatsParams {
  period?: DashboardPeriod;
}

export const useAdminDashboardStats = ({
  period = "month",
}: UseAdminDashboardStatsParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: ["admin", "dashboard", "stats", period],
    queryFn: async (): Promise<AdminDashboardStats | null> => {
      const { data, error } = await supabase.rpc("get_admin_dashboard_stats", {
        p_period: period,
      });

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return null;

      const row = data[0] as Record<string, unknown>;
      return {
        total_laundry_marts: Number(row.total_laundry_marts ?? 0),
        active_laundry_marts: Number(row.active_laundry_marts ?? 0),
        total_orders: Number(row.total_orders ?? 0),
        total_revenue: Number(row.total_revenue ?? 0),
        pending_payouts: Number(row.pending_payouts ?? 0),
        prev_total_laundry_marts: Number(row.prev_total_laundry_marts ?? 0),
        prev_active_laundry_marts: Number(row.prev_active_laundry_marts ?? 0),
        prev_total_orders: Number(row.prev_total_orders ?? 0),
        prev_total_revenue: Number(row.prev_total_revenue ?? 0),
        prev_pending_payouts: Number(row.prev_pending_payouts ?? 0),
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
