"use client";
import { useMutation } from "@tanstack/react-query";
import { createSupabaseClient } from "../supabase/client";

export const useVendorSignUpWithEmail = () => {
  return useMutation({
    meta: {
      successMessage: "Confirmation email sent",
      showErrorMessage: true,
    },
    mutationKey: ["vendor", "signup"],
    mutationFn: async ({
      email,
      password,
      full_name,
    }: {
      email: string;
      password: string;
      full_name: string;
    }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/vendor/signin`,
          data: {
            full_name: full_name,
            role: "admin", // Changed from "vendor" to "admin" - vendors are admins of their business
          },
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      if (!data.user?.id) {
        throw new Error("User ID not found after sign up.");
      }

      return {
        user: data.user,
      };
    },
  });
};
