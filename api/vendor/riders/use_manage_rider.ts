import { ICreateRiderFormData } from "@/components/modals/riders/rider_utils";
import { useMutation } from "@tanstack/react-query";
import { createRider } from "@/app/actions/create_rider";
import { uploadFile } from "@/api/supabase/supabase_file_upload";
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
          path: `${result.data.id}/avatar`,
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
