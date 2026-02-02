"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import type { Database } from "@/database.types";

type OrdersReportRow =
  Database["public"]["Functions"]["get_orders_report_sheet"]["Returns"][number];
type GetOrdersReportArgs =
  Database["public"]["Functions"]["get_orders_report_sheet"]["Args"];

export type FinancialReportRow =
  Database["public"]["Functions"]["get_vendor_financial_report"]["Returns"][number];
type GetVendorFinancialReportArgs =
  Database["public"]["Functions"]["get_vendor_financial_report"]["Args"];

export type VendorPaymentRow =
  Database["public"]["Functions"]["get_vendor_payments_report"]["Returns"][number];
type GetVendorPaymentsReportArgs =
  Database["public"]["Functions"]["get_vendor_payments_report"]["Args"];

export type VendorReportStatsRow =
  Database["public"]["Functions"]["get_vendor_report_stats"]["Returns"][number];
type GetVendorReportStatsArgs =
  Database["public"]["Functions"]["get_vendor_report_stats"]["Args"];

/** -----------------------------
 * Orders report (sheet rows)
 * ------------------------------*/
export interface UseGenerateOrdersReportsParams {
  startDate?: Date;
  endDate?: Date;
  enabled?: boolean;
}

export const useGenerateOrdersReports = ({
  startDate,
  endDate,
  enabled = true,
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
    enabled: !!vendor?.id && enabled,
    queryFn: async (): Promise<OrdersReportRow[] | null> => {
      if (!vendor?.id) return null;
      const args: GetOrdersReportArgs = {
        p_vendor_id: vendor.id,
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc(
        "get_orders_report_sheet",
        args
      );
      if (error) throw new Error(error.message);
      return data ?? null;
    },
  });
};

/** -----------------------------
 * Financial summary report
 * ------------------------------*/
export interface UseGenerateFinancialReportsParams {
  vendorId?: string;
  startDate?: Date;
  endDate?: Date;
  enabled?: boolean;
}

export const useGenerateFinancialReports = ({
  vendorId,
  startDate,
  endDate,
  enabled = true,
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
    enabled: !!vendorId && enabled,
    queryFn: async (): Promise<FinancialReportRow | null> => {
      if (!vendorId) return null;

      const args: GetVendorFinancialReportArgs = {
        p_vendor_id: vendorId,
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc(
        "get_vendor_financial_report",
        args
      );

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return null;
      return data[0] as FinancialReportRow;
    },
  });
};

/** -----------------------------
 * Nominal payments report
 * ------------------------------*/
export interface UseGeneratePaymentsReportParams {
  vendorId?: string;
  startDate?: Date;
  endDate?: Date;
  enabled?: boolean;
}

export const useGeneratePaymentsReport = ({
  vendorId,
  startDate,
  endDate,
  enabled = true,
}: UseGeneratePaymentsReportParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "reports",
      "payments",
      vendorId,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    enabled: !!vendorId && enabled,
    queryFn: async (): Promise<VendorPaymentRow[] | null> => {
      if (!vendorId) return null;

      const args: GetVendorPaymentsReportArgs = {
        p_vendor_id: vendorId,
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc(
        "get_vendor_payments_report",
        args
      );

      if (error) throw new Error(error.message);
      return data ?? null;
    },
  });
};

/** -----------------------------
 * Vendor stats (for StatCard)
 * ------------------------------*/
export interface UseVendorReportStatsParams {
  vendorId?: string;
  startDate?: Date;
  endDate?: Date;
}

export const useVendorReportStats = ({
  vendorId,
  startDate,
  endDate,
}: UseVendorReportStatsParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "reports",
      "stats",
      vendorId,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    enabled: !!vendorId,
    queryFn: async (): Promise<VendorReportStatsRow | null> => {
      if (!vendorId) return null;
      const args: GetVendorReportStatsArgs = {
        p_vendor_id: vendorId,
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc(
        "get_vendor_report_stats",
        args
      );
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return null;
      return data[0] as VendorReportStatsRow;
    },
  });
};
