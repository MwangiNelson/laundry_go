import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";

export const useVendorEarningsOvertime = () => {
  return useQuery({
    queryKey: ["vendor-transactions"],
    queryFn: async () => {
   
    },
  });
};