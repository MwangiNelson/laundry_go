"use client";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export type AdminTransactionStatusFilter = "all" | "paid" | "pending" | "failed" | "refunded";

export interface AdminTransactionsPageRow {
  order_id: string;
  paid_at: string | null;
  created_at: string;
  amount: number;
  commission: number;
  vendor_payout: number;
  status: string | null;
  vendor_id: string | null;
  vendor_name: string | null;
  customer_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: string | null;
  payment_channel: string | null;
  payment_reference: string | null;
}

export interface AdminTransactionsPageResponse {
  data: AdminTransactionsPageRow[];
  total_count: number;
  has_next: boolean;
}

export interface UseAdminTransactionStatsParams {
  startDate?: Date;
  endDate?: Date;
  status?: AdminTransactionStatusFilter;
  /** Defaults to 0.10 in the DB function. */
  commissionRate?: number;
}



export const useAdminTransactionStats = ({
  startDate,
  endDate,
  status = "all",
  commissionRate,
}: UseAdminTransactionStatsParams = {}) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "admin",
      "transactions",
      "stats",
      status,
      commissionRate,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: async ()=> {
      const { data, error } = await supabase.rpc("get_admin_transactions_stats", {
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
        p_status: status,
        p_commission_rate: commissionRate,
      });

      if (error) throw new Error(error.message);
    
      return data?.[0] ?? null;
    },
  });
};

export interface UseAdminTransactionsPageParams {
  page: number;
  page_size: number;
  search?: string;
  status?: AdminTransactionStatusFilter;
  sort_by?: "paid_at" | "amount" | "vendor_name" | "customer_name";
  sort_order?: "ASC" | "DESC";
  startDate?: Date;
  endDate?: Date;
  commissionRate?: number;
}

export const useAdminTransactionsPage = ({
  page,
  page_size,
  search,
  status = "all",
  sort_by = "paid_at",
  sort_order = "DESC",
  startDate,
  endDate,
  commissionRate,
}: UseAdminTransactionsPageParams) => {
  const supabase = createSupabaseClient();

  return useQuery({
    queryKey: [
      "admin",
      "transactions",
      "page",
      page,
      page_size,
      search,
      status,
      sort_by,
      sort_order,
      startDate?.toISOString(),
      endDate?.toISOString(),
      commissionRate,
    ],
    queryFn: async (): Promise<AdminTransactionsPageResponse | null> => {
      const { data, error } = await supabase.rpc(
        "get_admin_transactions_page",
        {
          p_page: page,
          p_page_size: page_size,
          p_search: search ?? undefined,
          p_status: status,
          p_sort_by: sort_by,
          p_sort_order: sort_order,
          p_start_date: startDate ? startDate.toISOString() : undefined,
          p_end_date: endDate ? endDate.toISOString() : undefined,
          p_commission_rate: commissionRate ?? undefined,
        } as Record<string, unknown>
      );

      if (error) throw new Error(error.message);
      const rows = data as unknown as Array<{
        data: unknown;
        total_count: number;
        has_next: boolean;
      }>;
      if (!rows || rows.length === 0) return null;

      const payload = rows[0];
      const list = (payload.data ?? []) as unknown as AdminTransactionsPageRow[];
      // Normalize numeric fields that may come back as strings/null
      const normalized = list.map((r) => ({
        ...r,
        amount: Number(r.amount ?? 0),
        commission: Number(r.commission ?? 0),
        vendor_payout: Number(r.vendor_payout ?? 0),
      }));
      return {
        data: normalized,
        total_count: Number(payload.total_count ?? 0),
        has_next: Boolean(payload.has_next),
      };
    },
  });
};


