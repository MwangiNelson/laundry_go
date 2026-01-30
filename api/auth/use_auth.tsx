"use client";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "../supabase/client";
import { replaceFile, uploadFile } from "@/api/supabase/supabase_file_upload";
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
      rememberMe = false,
    }: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("lastSignedInEmail", email);
        // Set expiration to 30 days from now
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        localStorage.setItem(
          "rememberMeExpiration",
          expirationDate.toISOString()
        );
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("lastSignedInEmail");
        localStorage.removeItem("rememberMeExpiration");
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
          *,
          vendor_users(
            *,
            vendors(
              *,
              location:locations(*)
            )
          )
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
  });
};
export const useConfirmEmailOtp = () => {
  const router = useRouter();
  return useMutation({
    meta: {
      successMessage: "OTP Verification Success",
      showErrorMessage: true,
    },
    mutationFn: async ({ email, token }: { email: string; token: string }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// update user profile
type UpdateUserProfileParams = {
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  profile_photo?: File;
  current_avatar_url?: string | null;
};

export const useUpdateUserProfile = () => {
  return useMutation({
    meta: {
      successMessage: "Profile updated",
      showErrorMessage: true,
      invalidateQueries: [["user"]],
    },
    mutationFn: async (params: UpdateUserProfileParams) => {
      const client = createSupabaseClient();
      let avatarUrl = params.current_avatar_url ?? null;
      if (params.profile_photo) {
        // Use documents bucket by default

        if (avatarUrl) {
          const result = await replaceFile({
            file: params.profile_photo,
            publicUrl: avatarUrl,
            options: {
              bucket: "profiles",
              path: `${params.user_id}/avatar`,
            },
          });
          avatarUrl = result?.url || avatarUrl;
        } else {
          const result = await uploadFile(params.profile_photo, {
            bucket: "documents",
            path: `user-assets/${params.user_id}/avatar.jpg`,
          });
          avatarUrl = result.url;
        }
      }

      const { data, error } = await client
        .from("profiles")
        .update({
          full_name: params.full_name,
          phone: params.phone,
          email: params.email,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.user_id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

//send recovery email

export const useResendRecoveryOtp = () => {
  return useMutation({
    mutationKey: ["recovery-otp"],
    mutationFn: async ({ email }: { email: string }) => {
      const client = createSupabaseClient();
      const { data, error } = await client.auth.resetPasswordForEmail(email);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
