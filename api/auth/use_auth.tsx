"use client";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../supabase/client";
export const useLoginWithEmail = () => {
  const router = useRouter();
  return useMutation({
    meta: {
      successMessage: "Login successful",
      showErrorMessage: true,
    },
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useGetUser = (user_id: string | undefined) => {
  const client = createSupabaseClient();
  return useQuery({
    queryKey: ["user", user_id],
    queryFn: async () => {
      if (!user_id) return undefined;
      const { data, error } = await client
        .from("profiles")
        .select(
          `
          *
        `
        )
        .eq("id", user_id!)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    meta: {
      showErrorMessage: false,
    },
    enabled: !!user_id,
  });
};
export type IUser = ReturnType<typeof useGetUser>["data"];

//verfiy otp code
export const useVerifyOTPCode = () => {
  const router = useRouter();
  return useMutation({
    meta: {
      successMessage: "OTP verified",
      showErrorMessage: true,
    },
    mutationFn: async ({ access_token }: { access_token: string }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.verifyOtp({
        email: localStorage.getItem("recovery_email") || "",
        token: access_token,
        type: "recovery",
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      router.push("/auth/reset-password");
    },
  });
};
//
export const useVerifyOtp = () => {
  const router = useRouter();
  return useMutation({
    meta: {
      successMessage: "OTP verified",
      showErrorMessage: true,
    },
    mutationFn: async ({ access_token }: { access_token: string }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.verifyOtp({
        email: localStorage.getItem("recovery_email") || "",
        token: access_token,
        type: "recovery",
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      router.push("/auth/set-new-password");
    },
  });
};

//set new password
export const useSetNewPassword = () => {
  const router = useRouter();
  return useMutation({
    meta: {
      successMessage: "Password reset successful",
      showErrorMessage: true,
    },
    mutationFn: async ({ password }: { password: string }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.updateUser({
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      router.push("/auth/password-success");
    },
  });
};
