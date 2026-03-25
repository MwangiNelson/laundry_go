import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { toast } from "sonner";

// ─── Vendor Service (add / remove) ──────────────────────────

export const useAddVendorService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      vendor_id: string;
      service_id: string;
    }) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_services")
        .insert({
          vendor_id: params.vendor_id,
          service_id: params.service_id,
          is_enabled: true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Service added successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to add service"),
  });
};

export const useDeleteVendorService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) => {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("vendor_services")
        .delete()
        .eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Service removed successfully");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove service"),
  });
};

// ─── Kg Pricing ─────────────────────────────────────────────

export const useUpsertKgPricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      vendor_service_id: string;
      standard_cost_per_kg: number;
      express_cost_per_kg: number;
    }) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_service_kg_pricing")
        .upsert(
          {
            vendor_service_id: params.vendor_service_id,
            standard_cost_per_kg: params.standard_cost_per_kg,
            express_cost_per_kg: params.express_cost_per_kg,
          },
          { onConflict: "vendor_service_id" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Kg pricing updated");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to update kg pricing"),
  });
};

// ─── Item Pricing ───────────────────────────────────────────

export const useAddItemPricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      vendor_service_id: string;
      item_id: string;
      standard_price: number;
      express_price: number;
    }) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_service_item_pricing")
        .insert(params)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Item pricing added");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to add item pricing"),
  });
};

export const useUpdateItemPricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      standard_price: number;
      express_price: number;
    }) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_service_item_pricing")
        .update({
          standard_price: params.standard_price,
          express_price: params.express_price,
        })
        .eq("id", params.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Item pricing updated");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to update item pricing"),
  });
};

export const useDeleteItemPricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) => {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("vendor_service_item_pricing")
        .delete()
        .eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Item pricing removed");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove item pricing"),
  });
};

// ─── Room Rates ─────────────────────────────────────────────

export const useAddRoomRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      vendor_service_id: string;
      service_room_id: string;
      regular_cost: number;
      deep_cost: number;
    }) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_service_room_rates")
        .insert(params)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Room rate added");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to add room rate"),
  });
};

export const useUpdateRoomRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      service_room_id: string;
      regular_cost: number;
      deep_cost: number;
    }) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("vendor_service_room_rates")
        .update({
          service_room_id: params.service_room_id,
          regular_cost: params.regular_cost,
          deep_cost: params.deep_cost,
        })
        .eq("id", params.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Room rate updated");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to update room rate"),
  });
};

export const useDeleteRoomRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string }) => {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("vendor_service_room_rates")
        .delete()
        .eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_vendor_services"] });
      toast.success("Room rate removed");
    },
    onError: (error: Error) =>
      toast.error(error.message || "Failed to remove room rate"),
  });
};
