"use client";
import { useMutation } from "@tanstack/react-query";
import { createSupabaseClient } from "../../supabase/client";
import {
  TOnboardingFormData,
  TServiceAndPricing,
} from "@/components/pageUIs/vendor/onboarding/onboarding_utils";
import { Database, TablesInsert } from "@/database.types";
import { uploadFile } from "@/api/supabase/supabase_file_upload";

export interface SaveVendorPricesParams {
  vendorId: string;
  services: TServiceAndPricing;
}

const saveVendorPrices = async ({
  vendorId,
  services,
}: SaveVendorPricesParams) => {
  const supabase = createSupabaseClient();
  const pricesToInsert: TablesInsert<"vendor_prices">[] = [];

  // Handle new laundry structure with multiple options per item
  if (services.laundry.enabled) {
    services.laundry.items.forEach((item) => {
      // Each item now has an options array with enabled/disabled state
      item.options
        .filter((option) => option.enabled && option.price > 0)
        .forEach((option) => {
          pricesToInsert.push({
            vendor_id: vendorId,
            service_item_id: item.service_item_id,
            service_option_id: option.service_option_id,
            price: option.price,
            is_available: true,
          });
        });
    });
  }
  if (services.moving.enabled) {
    services.moving.items.forEach((item) => {
      pricesToInsert.push({
        vendor_id: vendorId,
        service_item_id: item.service_item_id,
        service_option_id: null, // Moving doesn't have options
        price: item.price,
        is_available: true,
      });
    });
  }
  if (services.house_cleaning.enabled) {
    services.house_cleaning.items.forEach((item) => {
      // Add regular clean price
      if (item.regular_clean_option_id && item.regular_clean_price > 0) {
        pricesToInsert.push({
          vendor_id: vendorId,
          service_item_id: item.service_item_id,
          service_option_id: item.regular_clean_option_id,
          price: item.regular_clean_price,
          is_available: true,
        });
      }
      // Add deep clean price
      if (item.deep_clean_option_id && item.deep_clean_price > 0) {
        pricesToInsert.push({
          vendor_id: vendorId,
          service_item_id: item.service_item_id,
          service_option_id: item.deep_clean_option_id,
          price: item.deep_clean_price,
          is_available: true,
        });
      }
    });
  }
  if (services.office_cleaning.enabled) {
    services.office_cleaning.items.forEach((item) => {
      // Add regular clean price
      if (item.regular_clean_option_id && item.regular_clean_price > 0) {
        pricesToInsert.push({
          vendor_id: vendorId,
          service_item_id: item.service_item_id,
          service_option_id: item.regular_clean_option_id,
          price: item.regular_clean_price,
          is_available: true,
        });
      }
      // Add deep clean price
      if (item.deep_clean_option_id && item.deep_clean_price > 0) {
        pricesToInsert.push({
          vendor_id: vendorId,
          service_item_id: item.service_item_id,
          service_option_id: item.deep_clean_option_id,
          price: item.deep_clean_price,
          is_available: true,
        });
      }
    });
  }
  if (services.fumigation.enabled) {
    services.fumigation.items.forEach((item) => {
      pricesToInsert.push({
        vendor_id: vendorId,
        service_item_id: item.service_item_id,
        service_option_id: null, // Fumigation doesn't have options
        price: item.price,
        is_available: true,
      });
    });
  }
  const { error: deleteError } = await supabase
    .from("vendor_prices")
    .delete()
    .eq("vendor_id", vendorId);
  if (deleteError) throw deleteError;

  if (pricesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("vendor_prices")
      .insert(pricesToInsert);

    if (insertError) throw insertError;
  }

  return { success: true, count: pricesToInsert.length };
};

export const useCreateVendor = () => {
  return useMutation({
    mutationFn: async (vendorData: TOnboardingFormData) => {
      const supabase = createSupabaseClient();
      const vendor_admin: Database["public"]["Tables"]["vendors"]["Insert"] = {
        admin_id: vendorData.admin_user_id!,
        email: vendorData.business_information.email,
        business_name: vendorData.business_information.business_name,
        phone: vendorData.business_information.phone_number,
        address: vendorData.business_information.address,
        operation_hours: JSON.parse(JSON.stringify(vendorData.operation_hours)),
        profile_complete: true,
        profile_completed_at: new Date().toISOString(),
        status: "pending",
      };
      const { data: vendor, error: vendorError } = await supabase
        .from("vendors")
        .insert(vendor_admin)
        .select()
        .single();
      if (vendorError) throw vendorError;
      if (!vendor) throw new Error("Failed to create vendor");

      if (vendorData.business_information.logo) {
        await uploadFile(vendorData.business_information.logo, {
          bucket: "vendor-assets",
          path: `${vendor.id}/logo.png`,
        });
      }
      if (vendorData.business_information.business_lincense) {
        await uploadFile(vendorData.business_information.business_lincense, {
          bucket: "vendor-assets",
          path: `${vendor.id}/license.pdf`,
        });
      }
      await saveVendorPrices({
        vendorId: vendor.id,
        services: vendorData.service_and_pricing,
      });
      return { success: true, vendor };
    },
  });
};
