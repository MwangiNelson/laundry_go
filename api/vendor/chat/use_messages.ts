import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { Database } from "@/database.types";
import { useMutation } from "@tanstack/react-query";
import { useVendor } from "@/components/context/vendors/vendor_provider";

export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

/**
 * Fetch messages for a given chat, ordered oldest → newest.
 * Also subscribes to realtime changes to keep the list fresh.
 */
export const useMessages = (chatId?: string) => {
  const supabase = createSupabaseClient();
  const queryClient = useQueryClient();

  const query = useQuery<MessageRow[]>({
    queryKey: ["chat", "messages", chatId],
    enabled: !!chatId,
    queryFn: async () => {
      if (!chatId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!chatId) return;
    const channel = supabase
      .channel(`messages:chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["chat", "messages", chatId],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["chat", "messages", chatId],
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["chat", "messages", chatId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient, supabase]);

  return query;
};

//mark all messages in a chat as read
export const useMarkMessagesAsRead = () => {
  const supabase = createSupabaseClient();
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      invalidateQueries: [["chat"], ["messages"]],
    },
    mutationFn: async (chatId: string) => {
      const { data, error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("chat_id", chatId);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
//send new message in a chat
export const useSendMessage = () => {
  const supabase = createSupabaseClient();
  const queryClient = useQueryClient();
  return useMutation({
    meta: {
      invalidateQueries: [["chat"], ["messages"]],
    },
    mutationFn: async ({
      chatId,
      senderId,
      content,
    }: {
      chatId: string;
      senderId: string;
      content: string;
    }) => {
      const { data, error } = await supabase.from("messages").insert({
        chat_id: chatId,
        sender_id: senderId,
        content: content,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
//use getll all unread messages for a vendor, cjust return the count
export const useGetAllUnreadMessagesCount = () => {
  const supabase = createSupabaseClient();
  const queryClient = useQueryClient();
  const { vendor } = useVendor();

  const query = useQuery({
    queryKey: ["unread-messages-count", vendor?.id],
    enabled: !!vendor?.id,
    queryFn: async () => {
      if (!vendor?.id) return 0;

      const { data, error } = await supabase.rpc(
        "get_vendor_unread_messages_count" ,
        {
          p_vendor_id: vendor.id,
        }
      ) as { data: number | null; error: Error | null };
      
      if (error) {
        throw new Error(error.message);
      }

      return typeof data === "number" ? data : 0;
    },
  });

  useEffect(() => {
    if (!vendor?.id) return;

    // Subscribe to message changes to keep unread count updated
    // Note: We subscribe to all message changes since messages table doesn't have vendor_id
    // The RPC function will filter correctly by vendor_id via the chats join
    const channel = supabase
      .channel(`unread-messages-count:vendor:${vendor.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["unread-messages-count", vendor.id],
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
          queryClient.invalidateQueries({
            queryKey: ["unread-messages-count", vendor.id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vendor?.id, queryClient, supabase]);

  return query;
};