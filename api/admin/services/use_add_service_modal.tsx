"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { uploadFile } from "@/api/supabase/supabase_file_upload";
import { IAddServiceItemModal } from "@/components/modals/admin/services/add_services_items.modal";
import { Database } from "@/database.types";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useAddServiceModal = () => {
  return useMutation({
    mutationFn: async (data: IAddServiceItemModal) => {
      const supabase = createSupabaseClient();
      const { data: mainService } = await supabase
        .from("main_services")
        .select("id")
        .eq("slug", data.main_service_slug)
        .single();
      if (!mainService) {
        throw new Error("Main service not found");
      }
      let service_url = "";
      if (data.image instanceof File) {
        const { url } = await uploadFile(data.image, {
          bucket: "services",
          path: `/${data.main_service_slug}/${data.service_item}-${Date.now()}`,
        });
        service_url = url;
      }
      const _data: Database["public"]["Tables"]["service_items"]["Insert"] = {
        main_service_id: mainService.id,
        name: data.service_item,
        icon_path: service_url || null,
        is_active: data.status === "active",
        
      };
      await supabase
        .from("service_items")
        .insert({
          main_service_id: mainService.id,
          name: data.service_item,
          icon_path: service_url || null,
          status: data.status,
        })
        .select()
        .single();
    },
  });
};
