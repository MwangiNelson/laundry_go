import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { useVendor } from "@/components/context/vendors/vendor_provider";

export type VendorServiceKgPricing = {
  id: string;
  standard_cost_per_kg: number | null;
  express_cost_per_kg: number | null;
  per_kg_weight_threshold: number | null;
};

export type VendorServiceItemPricing = {
  id: string;
  item_id: string;
  item_name: string | null;
  standard_price: number | null;
  express_price: number | null;
  pricing_basis_standard: string | null;
  pricing_basis_express: string | null;
};

export type VendorServiceRoomRate = {
  id: string;
  service_room_id: string;
  room_name: string;
  regular_cost: number | null;
  deep_cost: number | null;
};

export type VendorServiceData = {
  id: string;
  vendor_id: string;
  service_id: string;
  is_enabled: boolean;
  service_name: string;
  service_type: "main" | "other";
  service_image_url: string | null;
  kg_pricing: VendorServiceKgPricing | null;
  item_pricing: VendorServiceItemPricing[];
  room_rates: VendorServiceRoomRate[];
};

export const useGetVendorServices = () => {
  const { vendor } = useVendor();
  return useQuery({
    queryKey: ["get_vendor_services", vendor?.id],
    queryFn: async (): Promise<VendorServiceData[]> => {
      const supabase = createSupabaseClient();

      const { data: vendorServices, error: vsError } = await supabase
        .from("vendor_services")
        .select(
          "id, vendor_id, service_id, is_enabled, services(id, name, service_type, service_image_url)"
        )
        .eq("vendor_id", vendor!.id);

      if (vsError) throw vsError;
      if (!vendorServices?.length) return [];

      const vsIds = vendorServices.map((vs) => vs.id);

      const [kgResult, itemResult, roomResult] = await Promise.all([
        supabase
          .from("vendor_service_kg_pricing")
          .select(
            "id, vendor_service_id, standard_cost_per_kg, express_cost_per_kg"
          )
          .in("vendor_service_id", vsIds),
        supabase
          .from("vendor_service_item_pricing")
          .select(
            "id, vendor_service_id, item_id, standard_price, express_price, items(name)"
          )
          .in("vendor_service_id", vsIds),
        supabase
          .from("vendor_service_room_rates")
          .select("id, vendor_service_id, service_room_id, regular_cost, deep_cost, service_room:service_rooms(name)")
          .in("vendor_service_id", vsIds),
      ]);

      if (kgResult.error) throw kgResult.error;
      if (itemResult.error) throw itemResult.error;
      if (roomResult.error) throw roomResult.error;

      const kgMap = new Map(
        (kgResult.data ?? []).map((kg) => [kg.vendor_service_id, kg])
      );
      const itemMap = new Map<string, (typeof itemResult.data)[number][]>();
      (itemResult.data ?? []).forEach((ip) => {
        const existing = itemMap.get(ip.vendor_service_id) ?? [];
        existing.push(ip);
        itemMap.set(ip.vendor_service_id, existing);
      });
      const roomMap = new Map<string, (typeof roomResult.data)[number][]>();
      (roomResult.data ?? []).forEach((rr) => {
        const existing = roomMap.get(rr.vendor_service_id) ?? [];
        existing.push(rr);
        roomMap.set(rr.vendor_service_id, existing);
      });

      return vendorServices.map((vs) => {
        const service = vs.services as unknown as {
          id: string;
          name: string | null;
          service_type: string | null;
          service_image_url: string | null;
        };
        const kg = kgMap.get(vs.id);
        const items = itemMap.get(vs.id) ?? [];
        const rooms = roomMap.get(vs.id) ?? [];

        return {
          id: vs.id,
          vendor_id: vs.vendor_id,
          service_id: vs.service_id,
          is_enabled: vs.is_enabled ?? true,
          service_name: service?.name ?? "Unknown Service",
          service_type: (service?.service_type ?? "main") as "main" | "other",
          service_image_url: service?.service_image_url ?? null,
          kg_pricing: kg
            ? {
                id: kg.id,
                standard_cost_per_kg: kg.standard_cost_per_kg,
                express_cost_per_kg: kg.express_cost_per_kg,
                per_kg_weight_threshold: (kg as any).per_kg_weight_threshold ?? null,
              }
            : null,
          item_pricing: items.map((ip) => ({
            id: ip.id,
            item_id: ip.item_id,
            item_name:
              (ip.items as unknown as { name: string | null })?.name ?? null,
            standard_price: ip.standard_price,
            express_price: ip.express_price,
            pricing_basis_standard: (ip as any).pricing_basis_standard ?? null,
            pricing_basis_express: (ip as any).pricing_basis_express ?? null,
          })),
          room_rates: rooms.map((rr) => ({
            id: rr.id,
            service_room_id: rr.service_room_id,
            room_name:
              (rr as any).service_room?.name ?? "",
            regular_cost: rr.regular_cost,
            deep_cost: rr.deep_cost,
          })),
        };
      });
    },
    enabled: !!vendor?.id,
  });
};
