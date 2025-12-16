"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

interface IAssignRiderParams {
  order_id: string;
  rider_id: string;
}

export const useAssignRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: {
      successMessage: "Rider assigned successfully",
      showErrorMessage: true,
      invalidateQueries: [["orders"]],
    },
    mutationKey: ["orders", "assign-rider"],
    mutationFn: async ({ order_id, rider_id }: IAssignRiderParams) => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("orders")
        .update({
          rider_id: rider_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Failed to assign rider");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate orders queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
