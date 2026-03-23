"use client";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../supabase/client";
import { useAuth } from "@/components/context/auth_provider";

export const useGetVendor = () => {
  const { user } = useAuth();
  const client = createSupabaseClient();
  return useQuery({
    queryKey: ["vendor", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (user?.id) {
        const { data, error } = await client
          .from("vendor_users")
          .select(
            `
            *,
            vendors(
              *,
              location:locations(*),
              bank_details(*)
            )
          `
          )
          .eq("user_id", user?.id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        let vendor = data?.vendors;
        return {
          data,
          ...vendor,
        };
      }
    },
  });
};
