import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export interface AllServiceOption {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  service_item_id: string;
  is_active: boolean;
}

export interface AllServiceItem {
  id: string;
  name: string;
  type: string;
  icon_path: string | null;
  display_order: number;
  main_service_id: number;
  is_active: boolean;
  options: AllServiceOption[];
}

export interface AllServiceData {
  main_service_id: number;
  main_service_name: string;
  main_service_slug: string;
  service_items: AllServiceItem[];
}

/**
 * Fetches ALL available service items and options for a specific service,
 * regardless of whether the vendor has added them to their prices
 */
export const useGetAllServiceItems = (mainServiceId: number | null) => {
  return useQuery({
    queryKey: ["all_service_items", mainServiceId],
    queryFn: async (): Promise<AllServiceData | null> => {
      if (!mainServiceId) return null;

      const supabase = createSupabaseClient();

      // Get main service info
      const { data: mainService, error: mainServiceError } = await supabase
        .from("main_services")
        .select("id, service, slug")
        .eq("id", mainServiceId)
        .single();

      if (mainServiceError) throw mainServiceError;
      if (!mainService) return null;

      // Get all active service items for this service
      const { data: serviceItems, error: itemsError } = await supabase
        .from("service_items")
        .select("*")
        .eq("main_service_id", mainServiceId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (itemsError) throw itemsError;

      // Get all options for each service item
      const itemsWithOptions = await Promise.all(
        (serviceItems || []).map(async (item) => {
          const { data: options, error: optionsError } = await supabase
            .from("service_options")
            .select("*")
            .eq("service_item_id", item.id)
            .eq("is_active", true)
            .order("display_order", { ascending: true });

          if (optionsError) throw optionsError;

          return {
            id: item.id,
            name: item.name,
            type: item.type,
            icon_path: item.icon_path,
            display_order: item.display_order,
            main_service_id: item.main_service_id,
            is_active: item.is_active,
            options: (options || []).map((opt) => ({
              id: opt.id,
              name: opt.name,
              description: opt.description,
              display_order: opt.display_order,
              service_item_id: opt.service_item_id,
              is_active: opt.is_active,
            })),
          } as AllServiceItem;
        })
      );

      return {
        main_service_id: mainService.id,
        main_service_name: mainService.service,
        main_service_slug: mainService.slug,
        service_items: itemsWithOptions,
      };
    },
    enabled: !!mainServiceId,
  });
};

