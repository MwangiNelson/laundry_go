"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export interface UseGeneratePaymentsReportParams {
  vendorId?: string;
  startDate?: Date;
  endDate?: Date;
}

export type VendorPaymentRow = {
  order_id: string;
  paid_at: string | null;
  amount: number;
  order_status: string | null;
  customer_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: string | null;
  payment_channel: string | null;
  payment_reference: string | null;
};

export const useGeneratePaymentsReport = ({
  vendorId,
  startDate,
  endDate,
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
    enabled: !!vendorId,
    queryFn: async (): Promise<VendorPaymentRow[] | null> => {
      if (!vendorId) return null;

      const { data, error } = await supabase.rpc("get_vendor_payments_report", {
        p_vendor_id: vendorId,
        p_start_date: startDate ? startDate.toISOString() : undefined,
        p_end_date: endDate ? endDate.toISOString() : undefined,
      });

      if (error) throw new Error(error.message);
      return (data ?? null) as VendorPaymentRow[] | null;
    },
  });
};


