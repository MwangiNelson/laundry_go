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
  type: string;
  icon_path: string | null;
  display_order: number;
  options: MergedOption[];
  // For items without options
  price?: number;
  is_available?: boolean;
  vendor_price_id?: string;
  has_vendor_price?: boolean;
}

/**
 * Unified hook to merge all available service items/options with vendor's existing prices
 * Handles both services with options (laundry, house_cleaning, office_cleaning) 
 * and services without options (moving, fumigation)
 */
export const useServiceMergedData = (
  service: VendorServiceData,
  allServiceItems: AllServiceData | null | undefined
): MergedItem[] => {
  return useMemo(() => {
    if (!allServiceItems) {
      // Return service items with proper type casting
      return service.service_items.map((item) => {
        if (item.options.length > 0) {
          return {
            ...item,
            options: item.options.map((opt) => ({
              ...opt,
              price: opt.price || 0,
              is_available: opt.is_available || false,
              vendor_price_id: opt.vendor_price_id,
              has_vendor_price: !!opt.vendor_price_id,
            })),
          } as MergedItem;
        } else {
          return {
            ...item,
            options: [],
            price: item.price || 0,
            is_available: item.is_available || false,
            vendor_price_id: item.vendor_price_id,
            has_vendor_price: !!item.vendor_price_id,
          } as MergedItem;
        }
      });
    }

    return allServiceItems.service_items.map((allItem) => {
      // Find vendor's existing item
      const vendorItem = service.service_items.find(
        (item) => item.id === allItem.id
      );

      // If item has options, merge them
      if (allItem.options.length > 0) {
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
      } else {
        // Item without options (moving, fumigation)
        return {
          ...allItem,
          options: [],
          price: vendorItem?.price || 0,
          is_available: vendorItem?.is_available || false,
          vendor_price_id: vendorItem?.vendor_price_id,
          has_vendor_price: !!vendorItem,
        };
      }
    });
  }, [allServiceItems, service.service_items]);
};

