import { ICreateRiderFormData } from "@/components/modals/riders/rider_utils";
import { useMutation } from "@tanstack/react-query";
import { createRider } from "@/app/actions/create_rider";
import { updateRider } from "@/app/actions/update_rider";
import { uploadFile, replaceFile } from "@/api/supabase/supabase_file_upload";
import { useVendor } from "@/components/context/vendors/vendor_provider";

export const useCreateRider = () => {
  const { vendor } = useVendor();
  return useMutation({
    mutationFn: async (data: ICreateRiderFormData) => {
      if (!vendor?.id) {
        throw new Error("Vendor ID is required");
      }
      const result = await createRider({
        vendor_id: vendor.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        license: data.license,
        vehicle: data.vehicle,
        vehiclePlate: data.vehiclePlate,
        notes: data.notes,
        status: data.status,
      });

      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to create rider");
      }

      if (data.profilePhoto) {
        await uploadFile(data.profilePhoto, {
          bucket: "profiles",
          path: `${result.data.user_id}/avatar`,
        });
      }
      return result.data;
    },
    meta: {
      invalidateQueries: [["riders"]],
      showErrorMessage: true,
      successMessage: "Rider created successfully",
    },
  });
};

export const useUpdateRider = () => {
  return useMutation({
    mutationFn: async ({
      riderId,
      userId,
      currentAvatarUrl,
      data,
    }: {
      riderId: string;
      userId: string;
      currentAvatarUrl?: string | null;
      data: ICreateRiderFormData;
    }) => {
      let avatarUrl = currentAvatarUrl;

      // Handle profile photo upload/replacement
      if (data.profilePhoto) {
        if (currentAvatarUrl) {
          const result = await replaceFile({
            file: data.profilePhoto,
            publicUrl: currentAvatarUrl,
            options: {
              bucket: "profiles",
              path: `${userId}/avatar`,
            },
          });
          avatarUrl = result?.url || currentAvatarUrl;
        } else {
          const result = await uploadFile(data.profilePhoto, {
            bucket: "profiles",
            path: `${userId}/avatar`,
          });
          avatarUrl = result.url;
        }
      }

      const result = await updateRider({
        rider_id: riderId,
        user_id: userId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        license: data.license,
        vehicle: data.vehicle,
        vehiclePlate: data.vehiclePlate,
        avatar_url: avatarUrl || undefined,
        notes: data.notes,
        status: data.status,
      });

      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to update rider");
      }

      return result.data;
    },
    meta: {
      invalidateQueries: [["riders"], ["rider"]],
      showErrorMessage: true,
      successMessage: "Rider updated successfully",
    },
  });
};
