/**
 * @deprecated This file is no longer used. The services settings now use
 * the new schema (services, vendor_services, vendor_service_item_pricing,
 * vendor_service_kg_pricing, vendor_service_room_rates).
 * See service_form.tsx for the current implementation.
 */

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

/** @deprecated */
export const useLaundryServiceMergedData = (
  _service: unknown,
  _allServiceItems: unknown
): MergedItem[] => {
  return [];
};
