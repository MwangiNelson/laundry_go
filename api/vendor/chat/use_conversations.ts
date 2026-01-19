import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { Database } from "@/database.types";
import { useVendor } from "@/components/context/vendors/vendor_provider";

//fetch conversations for vendor with latest message and unread count
export const useCreateConversation = () => {
  const supabase = createSupabaseClient();
  const queryClient = useQueryClient();
  const { vendor } = useVendor();
  return useQuery({
    queryKey: ["chat", "conversations", vendor?.id],
    enabled: !!vendor?.id,
    queryFn: async () => {
      if (!vendor?.id) return [];

      const { data, error } = await supabase.rpc(
        "get_vendor_chats_with_details",
        {
          p_vendor_id: vendor.id,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
