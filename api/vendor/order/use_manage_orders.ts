"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { IOrderStatus } from "./use_fetch_orders";

interface IAcceptOrderParams {
  order_id: string;
}

interface IRejectOrderParams {
  order_id: string;
}

interface IUpdateOrderStatusParams {
  order_id: string;
  status: IOrderStatus;
}

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: {
      successMessage: "Order accepted successfully",
      showErrorMessage: true,
      invalidateQueries: [["orders"]],
    },
    mutationKey: ["orders", "accept"],
    mutationFn: async ({ order_id }: IAcceptOrderParams) => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("orders")
        .update({
          status: "Ongoing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Failed to accept order");
      }

      return data;
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: {
      successMessage: "Order rejected successfully",
      showErrorMessage: true,
      invalidateQueries: [["orders"]],
    },
    mutationKey: ["orders", "reject"],
    mutationFn: async ({ order_id }: IRejectOrderParams) => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("orders")
        .update({
          status: "Cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Failed to reject order");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate orders queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

/**
 * Generic hook to update order status
 * Can be used for any status change
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: {
      successMessage: "Order status updated successfully",
      showErrorMessage: true,
    },
    mutationKey: ["orders", "update-status"],
    mutationFn: async ({ order_id, status }: IUpdateOrderStatusParams) => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("orders")
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Failed to update order status");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate orders queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
