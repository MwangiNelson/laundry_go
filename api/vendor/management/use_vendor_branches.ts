"use client";

import { createSupabaseClient } from "@/api/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TVendorBranchRow = {
  id: string;
  branch_name: string;
  email: string | null;
  invitation_status: string | null;
  branch_vendor_id: string | null;
  invited_at: string | null;
  accepted_at: string | null;
  location: {
    description: string | null;
    main_text: string | null;
    secondary_text: string | null;
  } | null;
};

const fetchVendorBranches = async (
  vendorId: string
): Promise<TVendorBranchRow[]> => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("vendor_branches")
    .select(
      `
        id,
        branch_name,
        email,
        invitation_status,
        branch_vendor_id,
        invited_at,
        accepted_at,
        location:locations(description, main_text, secondary_text)
      `
    )
    .eq("vendor_id", vendorId)
    .order("branch_name");

  if (error) throw error;
  return (data ?? []) as unknown as TVendorBranchRow[];
};

export const useVendorBranches = (vendorId?: string) =>
  useQuery({
    queryKey: ["vendor-branches", vendorId],
    enabled: !!vendorId,
    queryFn: () => fetchVendorBranches(vendorId!),
    staleTime: 30_000,
  });

// ─── Add Branch ──────────────────────────────────────────────────────────────

export const useAddBranch = () => {
  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  return useMutation({
    mutationFn: async ({
      vendorId,
      branchName,
      email,
    }: {
      vendorId: string;
      branchName: string;
      email: string;
    }) => {
      const { data, error } = await supabase
        .from("vendor_branches")
        .insert({
          vendor_id: vendorId,
          branch_name: branchName,
          email,
        })
        .select("id")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vendor-branches", variables.vendorId],
      });
    },
  });
};

// ─── Remove Branch ───────────────────────────────────────────────────────────

export const useRemoveBranch = () => {
  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  return useMutation({
    mutationFn: async ({
      branchId,
      vendorId,
    }: {
      branchId: string;
      vendorId: string;
    }) => {
      const { error } = await supabase
        .from("vendor_branches")
        .delete()
        .eq("id", branchId);

      if (error) throw error;
      return { branchId };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vendor-branches", variables.vendorId],
      });
    },
  });
};

// ─── Resend Invitation ───────────────────────────────────────────────────────

export const useResendBranchInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      branchId,
      branchEmail,
      branchName,
      parentVendorId,
      parentBusinessName,
    }: {
      branchId: string;
      branchEmail: string;
      branchName: string;
      parentVendorId: string;
      parentBusinessName: string;
    }) => {
      const { sendBranchInvitation } = await import(
        "@/app/actions/send_branch_invitation.action"
      );
      return sendBranchInvitation({
        branchId,
        branchEmail,
        branchName,
        parentVendorId,
        parentBusinessName,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vendor-branches", variables.parentVendorId],
      });
    },
  });
};
