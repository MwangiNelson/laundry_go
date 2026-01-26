import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile, replaceFile } from "@/api/supabase/supabase_file_upload";
import { createSupabaseClient } from "@/api/supabase/client";
import { Database } from "@/database.types";

type UpdateBusinessProfileParams = {
  vendor_id: string;
  user_id: string;
  business_name: string;
  phone_number: string;
  email: string;
  logo?: File;
  current_logo_url?: string;
};

type UpdateOperatingHoursParams = {
  vendor_id: string;
  operation_hours: Record<
    string,
    { start_time: string; end_time: string } | null
  >;
};

type UpdatePasswordParams = {
  current_password: string;
  new_password: string;
};

export const useUpdateBusinessProfile = () => {
  return useMutation({
    mutationFn: async (params: UpdateBusinessProfileParams) => {
      const supabase = createSupabaseClient();
      let logoUrl = params.current_logo_url;
      if (params.logo) {
        if (params.current_logo_url) {
          const result = await replaceFile({
            file: params.logo,
            publicUrl: params.current_logo_url,
          });
          logoUrl = result?.url;
        } else {
          const result = await uploadFile(params.logo, {
            bucket: "vendor-assets",
            path: `vendor-assets/${params.vendor_id}/logo`,
          });
          logoUrl = result.url;
        }
      }

      const updateData: Database["public"]["Tables"]["vendors"]["Update"] = {
        business_name: params.business_name,
        phone: params.phone_number,
        email: params.email,
        updated_at: new Date().toISOString(),
      };

      if (logoUrl !== undefined) {
        updateData.logo_url = logoUrl;
      }

      const { data, error: vendorError } = await supabase
        .from("vendors")
        .update(updateData)
        .eq("id", params.vendor_id)
        .select()
        .single();

      if (vendorError) {
        throw new Error(vendorError.message);
      }

      return data;
    },

    meta: {
      successMessage: "Business profile updated successfully",
      showErrorMessage: true,
      invalidateQueries: [["vendor"]],
    },
  });
};

export const useUpdateOperatingHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateOperatingHoursParams) => {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from("vendors")
        .update({
          operation_hours: params.operation_hours,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.vendor_id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },

    meta: {
      invalidateQueries: [["vendor"]],
      successMessage: "Operating hours updated successfully",
      showErrorMessage: true,
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (params: UpdatePasswordParams) => {
      const supabase = createSupabaseClient();

      // Update user password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: params.new_password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    meta: {
      successMessage: "Password updated successfully",
      showErrorMessage: true,
    },
  });
};
