"use client";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../supabase/client";

export const useGetVendor = ({
  admin_id,
}: {
  admin_id: string | undefined;
}) => {
  const client = createSupabaseClient();
  return useQuery({
    queryKey: ["vendor", admin_id],
    enabled: !!admin_id,
    queryFn: async () => {
      const { data, error } = await client
        .from("vendors")
        .select(
          `
          *
          
        `
        )
        .eq("admin_id", admin_id!)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
