"use client";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../supabase/client";

// create  a vendor sign up mutation
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
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      if (!data.user?.id) {
        throw new Error("User ID not found after sign up.");
      }
      const profile = await client.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: full_name,
          email: email,
        },
        {
          onConflict: "id",
        }
      );

      if (profile.error) {
        throw new Error(profile.error.message);
      }
      return {
        user: data.user,
        profile: profile.data,
      };
    },
  });
};
