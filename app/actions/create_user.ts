"use server";
import { createSupabaseAdmin } from "@/api/supabase/admin";
export const createUser = async ({
  email,
  phone,
  full_name,
  password,
}: {
  email: string;
  phone?: string;
  full_name: string;
  password: string;
}) => {
  const supabase = createSupabaseAdmin();
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      user_metadata: {
        full_name,
        phone,
        email,
      },
      email_confirm: false,
    });
    if (error) {
      throw new Error(error.message);
    }
    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      data: null,
      error: (error as Error).message ?? "An unexpected error occurred",
    };
  }
};
