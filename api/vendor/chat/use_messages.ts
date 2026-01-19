import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/supabase/client";
import { Database } from "@/database.types";
import { useMutation } from "@tanstack/react-query";

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
