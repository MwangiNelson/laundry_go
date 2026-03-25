"use server";

import { createSupabaseServer } from "@/api/supabase/server";

export async function exchangeCodeForSession(code: string) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
}
