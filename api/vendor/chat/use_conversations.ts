import { useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { useVendor } from "@/components/context/vendors/vendor_provider";

//fetch conversations for vendor with latest message and unread count
export const useCreateConversation = () => {
  const supabase = createSupabaseClient();
  const queryClient = useQueryClient();
  const { vendor } = useVendor();

  const query = useQuery({
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

  useEffect(() => {
    if (!vendor?.id) return;

    // Subscribe to changes on the chats table for this vendor
    const chatsChannel = supabase
      .channel(`conversations:vendor:${vendor.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `vendor_id=eq.${vendor.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["chat", "conversations", vendor.id],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chats",
          filter: `vendor_id=eq.${vendor.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["chat", "conversations", vendor.id],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chats",
          filter: `vendor_id=eq.${vendor.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["chat", "conversations", vendor.id],
          });
        }
      )
      .subscribe();

    // Also subscribe to message changes since they affect conversation details
    // (latest message, unread count, etc.)
    const messagesChannel = supabase
      .channel(`conversations:messages:vendor:${vendor.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          // Invalidate conversations when new messages are added
          // The RPC will recalculate latest message and unread counts
          queryClient.invalidateQueries({
            queryKey: ["chat", "conversations", vendor.id],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        () => {
          // Invalidate when messages are updated (e.g., marked as read)
          queryClient.invalidateQueries({
            queryKey: ["chat", "conversations", vendor.id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [vendor?.id, queryClient, supabase]);

  return query;
};
