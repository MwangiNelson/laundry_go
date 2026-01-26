"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ApproveVendorParams {
  vendorId: string;
}

export interface RejectVendorParams {
  vendorId: string;
  rejectionReason: string;
}

export interface SuspendVendorParams {
  vendorId: string;
  suspensionReason?: string;
}

export interface ActivateVendorParams {
  vendorId: string;
}

export const useApproveVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vendorId }: ApproveVendorParams) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendors")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          rejection_reason: null,
          suspended_at: null,
          suspension_reason: null,
        })
        .eq("id", vendorId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
  });
};

export const useRejectVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vendorId, rejectionReason }: RejectVendorParams) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendors")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", vendorId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
  });
};

export const useSuspendVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vendorId, suspensionReason }: SuspendVendorParams) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendors")
        .update({
          status: "suspended",
          suspension_reason: suspensionReason || null,
          suspended_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", vendorId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
  });
};

export const useActivateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vendorId }: ActivateVendorParams) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendors")
        .update({
          status: "approved",
          suspension_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", vendorId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
  });
};
