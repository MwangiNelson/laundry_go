"use client";
import { createSupabaseClient } from "@/api/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "../../../database.types";
import { IAddServiceItemModalSchema } from "@/components/modals/admin/services/add_services_items.modal";
import { IEditServiceItemModalSchema } from "@/components/modals/admin/services/edit_service_items.modal";
import { useMutation } from "@tanstack/react-query";
import {
  uploadFile,
  replaceFile,
  deleteFile,
} from "@/api/supabase/supabase_file_upload";

export const useFetchServicesAdmin = () => {
  return useQuery({
    queryKey: ["services", "admin"],
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from("main_services").select(`*,
        service_items (*,
          service_options (*)
        )
        `);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useGetMainServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["main_services", slug],
    queryFn: async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("main_services")
        .select("*")
        .eq("slug", slug as Database["public"]["Enums"]["main_services_types"])
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

//add servcie item
export const useAddServiceItem = () => {
  return useMutation({
    meta: {
      showErrorMessage: true,
      successMessage: "Service item added successfully",
      invalidateQueries: [["services", "admin"]],
    },
    mutationFn: async (data: IAddServiceItemModalSchema) => {
      let _url = "";
      if (data.image instanceof File) {
        const { url } = await uploadFile(data.image, {
          bucket: "services",
          path: `/${data.main_service_id}/${data.service_item}-${Date.now()}`,
        });
        _url = url;
      }
      const supabase = createSupabaseClient();
      const service_item: Database["public"]["Tables"]["service_items"]["Insert"] =
        {
          main_service_id: data.main_service_id,
          name: data.service_item,
          is_active: data.status === "active",
          icon_path: _url,
        };
      const { data: res_service_item, error: error_service_item } =
        await supabase
          .from("service_items")
          .insert(service_item)
          .select()
          .single();
      if (error_service_item) {
        throw new Error(error_service_item.message);
      }
      const service_options: Database["public"]["Tables"]["service_options"]["Insert"][] =
        data.service_options.map((option) => ({
          name: option.name,
          service_item_id: res_service_item.id,
          is_active: option.enabled ? true : false,
        }));
      const { data: res_service_options, error: error_service_options } =
        await supabase.from("service_options").insert(service_options);
      if (error_service_options) {
        throw new Error(error_service_options.message);
      }
      return {
        service_item: res_service_item,
        service_options: res_service_options,
      };
    },
  });
};
// edit service item
export const useEditServiceItem = () => {
  return useMutation({
    meta: {
      showErrorMessage: true,
      successMessage: "Service item updated successfully",
      invalidateQueries: [["services", "admin"]],
    },
    mutationFn: async ({
      id,
      data,
      oldIconPath,
    }: {
      id: string;
      data: IEditServiceItemModalSchema;
      oldIconPath: string | null;
    }) => {
      const supabase = createSupabaseClient();
      let newIconUrl = oldIconPath || "";
      let uploadedImageUrl: string | null = null;

      try {
        // Handle image upload/replacement
        if (data.image instanceof File) {
          const uploadResult = await replaceFile({
            file: data.image,
            publicUrl: oldIconPath,
            options: {
              bucket: "services",
              path: `/${data.main_service_id}/${data.service_item}-${Date.now()}`,
            },
          });
          if (!uploadResult) {
            throw new Error("Failed to upload image");
          }
          newIconUrl = uploadResult.url;
          uploadedImageUrl = uploadResult.url;
        }

        // Update service item
        const service_item: Database["public"]["Tables"]["service_items"]["Update"] =
          {
            name: data.service_item,
            is_active: data.status === "active",
            icon_path: newIconUrl || null,
          };

        const { error: error_service_item } = await supabase
          .from("service_items")
          .update(service_item)
          .eq("id", id)
          .select()
          .single();

        if (error_service_item) {
          // If error, delete uploaded image
          if (uploadedImageUrl && uploadedImageUrl !== oldIconPath) {
            await deleteFile(uploadedImageUrl);
          }
          throw new Error(error_service_item.message);
        }

        // Get existing service options
        const { data: existingOptions } = await supabase
          .from("service_options")
          .select("*")
          .eq("service_item_id", id);

        // Separate options into: update, create, delete
        const optionsToUpdate = data.service_options.filter(
          (opt) => opt.id && opt.enabled
        );
        const optionsToCreate = data.service_options.filter(
          (opt) => !opt.id && opt.enabled
        );
        const existingOptionIds = existingOptions?.map((opt) => opt.id) || [];
        const enabledOptionIds = data.service_options
          .filter((opt) => opt.enabled && opt.id)
          .map((opt) => opt.id!);
        const optionsToDelete = existingOptionIds.filter(
          (id) => !enabledOptionIds.includes(id)
        );

        // Update existing options
        for (const option of optionsToUpdate) {
          if (option.id) {
            const { error } = await supabase
              .from("service_options")
              .update({
                name: option.name,
                description: option.description,
                display_order: option.display_order,
                is_active: option.enabled,
              })
              .eq("id", option.id);

            if (error) {
              // If error, delete uploaded image
              if (uploadedImageUrl && uploadedImageUrl !== oldIconPath) {
                await deleteFile(uploadedImageUrl);
              }
              throw new Error(`Failed to update option: ${error.message}`);
            }
          }
        }

        // Create new options
        if (optionsToCreate.length > 0) {
          const newOptions: Database["public"]["Tables"]["service_options"]["Insert"][] =
            optionsToCreate.map((option) => ({
              name: option.name,
              service_item_id: id,
              description: option.description,
              display_order: option.display_order,
              is_active: option.enabled,
            }));

          const { error: error_create_options } = await supabase
            .from("service_options")
            .insert(newOptions);

          if (error_create_options) {
            // If error, delete uploaded image
            if (uploadedImageUrl && uploadedImageUrl !== oldIconPath) {
              await deleteFile(uploadedImageUrl);
            }
            throw new Error(
              `Failed to create options: ${error_create_options.message}`
            );
          }
        }

        // Delete removed options
        if (optionsToDelete.length > 0) {
          const { error: error_delete_options } = await supabase
            .from("service_options")
            .delete()
            .in("id", optionsToDelete);

          if (error_delete_options) {
            // If error, delete uploaded image
            if (uploadedImageUrl && uploadedImageUrl !== oldIconPath) {
              await deleteFile(uploadedImageUrl);
            }
            throw new Error(
              `Failed to delete options: ${error_delete_options.message}`
            );
          }
        }

        // Get updated service item with options
        const { data: updatedServiceItem } = await supabase
          .from("service_items")
          .select(
            `*,
            service_options (*)`
          )
          .eq("id", id)
          .single();

        return {
          service_item: updatedServiceItem,
        };
      } catch (error) {
        // Cleanup uploaded image on any error
        if (uploadedImageUrl && uploadedImageUrl !== oldIconPath) {
          await deleteFile(uploadedImageUrl).catch((deleteError) => {
            console.error("Failed to cleanup uploaded image:", deleteError);
          });
        }
        throw error;
      }
    },
  });
};

// delete service
export const useDeleteServiceItem = () => {
  return useMutation({
    meta: {
      showErrorMessage: true,
      successMessage: "Service deleted successfully",
      invalidateQueries: [["services", "admin"]],
    },
    mutationFn: async (id: string) => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("service_items")
        .delete()
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
