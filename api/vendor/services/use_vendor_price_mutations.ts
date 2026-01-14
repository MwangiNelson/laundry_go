import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { toast } from "sonner";

interface AddVendorPriceParams {
  vendor_id: string;
  service_item_id: string;
  service_option_id?: string | null;
  price: number;
  is_available?: boolean;
}

interface UpdateVendorPriceParams {
  id: string;
  price: number;
  is_available?: boolean;
}

interface DeleteVendorPriceParams {
  id: string;
}

export const useAddVendorPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AddVendorPriceParams) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_prices")
        .insert({
          vendor_id: params.vendor_id,
          service_item_id: params.service_item_id,
          service_option_id: params.service_option_id,
          price: params.price,
          is_available: params.is_available ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Service price added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add service price");
    },
  });
};

export const useUpdateVendorPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateVendorPriceParams) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_prices")
        .update({
          price: params.price,
          is_available: params.is_available,
        })
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Service price updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service price");
    },
  });
};

export const useDeleteVendorPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: DeleteVendorPriceParams) => {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("vendor_prices")
        .delete()
        .eq("id", params.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Service removed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove service");
    },
  });
};
