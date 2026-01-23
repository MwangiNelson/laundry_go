"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import type { Database } from "@/database.types";

// Admin reports - no vendor filtering, completed orders only

type AdminOrdersReportRow =
  Database["public"]["Functions"]["get_admin_orders_report"]["Returns"][number];
type GetAdminOrdersReportArgs =
  Database["public"]["Functions"]["get_admin_orders_report"]["Args"];

export type AdminFinancialReportRow =
  Database["public"]["Functions"]["get_admin_financial_report"]["Returns"][number];
type GetAdminFinancialReportArgs =
  Database["public"]["Functions"]["get_admin_financial_report"]["Args"];

export type AdminPaymentRow =
  Database["public"]["Functions"]["get_admin_payments_report"]["Returns"][number];
type GetAdminPaymentsReportArgs =
  Database["public"]["Functions"]["get_admin_payments_report"]["Args"];

export type AdminReportStatsRow =
  Database["public"]["Functions"]["get_admin_report_stats"]["Returns"][number];
type GetAdminReportStatsArgs =
  Database["public"]["Functions"]["get_admin_report_stats"]["Args"];

/** -----------------------------
 * Admin Orders report (completed orders only, all vendors)
 * ------------------------------*/
export interface UseGenerateAdminOrdersReportsParams {
  startDate?: Date;
  endDate?: Date;
}

export const useGenerateAdminOrdersReports = ({
  startDate,
  endDate,
}: UseGenerateAdminOrdersReportsParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "admin",
      "reports",
      "orders",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async (): Promise<AdminOrdersReportRow[] | null> => {
      const args: GetAdminOrdersReportArgs = {
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc(
        "get_admin_orders_report",
        args
      );
      if (error) throw new Error(error.message);
      return data ?? null;
    },
  });
};

/** -----------------------------
 * Admin Financial summary report
 * ------------------------------*/
export interface UseGenerateAdminFinancialReportsParams {
  startDate?: Date;
  endDate?: Date;
}

export const useGenerateAdminFinancialReports = ({
  startDate,
  endDate,
}: UseGenerateAdminFinancialReportsParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "admin",
      "reports",
      "financial",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async (): Promise<AdminFinancialReportRow | null> => {
      const args: GetAdminFinancialReportArgs = {
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc(
        "get_admin_financial_report",
        args
      );

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return null;
      return data[0] as AdminFinancialReportRow;
    },
  });
};

/** -----------------------------
 * Admin Nominal payments report
 * ------------------------------*/
export interface UseGenerateAdminPaymentsReportParams {
  startDate?: Date;
  endDate?: Date;
}

export const useGenerateAdminPaymentsReport = ({
  startDate,
  endDate,
}: UseGenerateAdminPaymentsReportParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "admin",
      "reports",
      "payments",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async (): Promise<AdminPaymentRow[] | null> => {
      const args: GetAdminPaymentsReportArgs = {
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc(
        "get_admin_payments_report",
        args
      );

      if (error) throw new Error(error.message);
      return data ?? null;
    },
  });
};

/** -----------------------------
 * Admin Stats (for stat cards)
 * ------------------------------*/
export interface UseAdminReportStatsParams {
  startDate?: Date;
  endDate?: Date;
}

export const useAdminReportStats = ({
  startDate,
  endDate,
}: UseAdminReportStatsParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "admin",
      "reports",
      "stats",
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async (): Promise<AdminReportStatsRow | null> => {
      const args: GetAdminReportStatsArgs = {
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      };
      const { data, error } = await supabase.rpc("get_admin_report_stats", args);

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return null;
      return data[0] as AdminReportStatsRow;
    },
  });
};

