"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export interface UseGenerateFinancialReportsParams {
  vendorId?: string;
  startDate?: Date;
  endDate?: Date;
}

type FinancialReportRow = {
  vendor_id: string;
  total_paid_orders: number;
  total_revenue: number;
  average_order_value: number;
  min_order_value: number | null;
  max_order_value: number | null;
  report_start: string | null;
  report_end: string | null;
};

export const useGenerateFinancialReports = ({
  vendorId,
  startDate,
  endDate,
}: UseGenerateFinancialReportsParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "reports",
      "financial",
      vendorId,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    enabled: !!vendorId,
    queryFn: async (): Promise<FinancialReportRow | null> => {
      if (!vendorId) return null;

      const { data, error } = await supabase.rpc("get_vendor_financial_report", {
        p_vendor_id: vendorId,
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      });

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return null;

      // `rpc` returns an array for SETOF/TABLE functions
      return data[0] as FinancialReportRow;
    },
  });
};


