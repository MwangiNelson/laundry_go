import { useMemo } from "react";
import { VendorServiceData } from "@/api/vendor/services/use_get_vendor_services";
import { AllServiceData } from "@/api/vendor/services/use_get_all_service_items";

export interface MergedOption {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  vendor_price_id?: string;
  has_vendor_price: boolean;
}

export interface MergedItem {
  id: string;
  name: string;
  icon_path: string | null;
  display_order: number;
  options: MergedOption[];
}

/**
 * Custom hook to merge all available service items/options with vendor's existing prices
 */
export const useLaundryServiceMergedData = (
  service: VendorServiceData,
  allServiceItems: AllServiceData | null | undefined
): MergedItem[] => {
  return useMemo(() => {
    if (!allServiceItems) {
      // Transform service items to MergedItem format
      return service.service_items.map((item) => ({
        ...item,
        options: item.options.map((opt) => ({
          ...opt,
          price: opt.price || 0,
          is_available: opt.is_available || false,
          vendor_price_id: opt.vendor_price_id,
          has_vendor_price: !!opt.vendor_price_id,
        })),
      }));
    }

    return allServiceItems.service_items.map((allItem) => {
      // Find vendor's existing item
      const vendorItem = service.service_items.find(
        (item) => item.id === allItem.id
      );

      // Merge options: show all available options, mark which ones vendor has
      const mergedOptions: MergedOption[] = allItem.options.map((allOption) => {
        const vendorOption = vendorItem?.options.find(
          (opt) => opt.id === allOption.id
        );

        return {
          ...allOption,
          price: vendorOption?.price || 0,
          is_available: vendorOption?.is_available || false,
          vendor_price_id: vendorOption?.vendor_price_id,
          has_vendor_price: !!vendorOption,
        };
      });

      return {
        ...allItem,
        options: mergedOptions,
      };
    });
  }, [allServiceItems, service.service_items]);
};
