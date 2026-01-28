"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createVendorUser } from "@/app/actions/send_verification_email.action";

export const useVendorSignUpWithEmail = () => {
  const router = useRouter();

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
      const result = await createVendorUser({
        email,
        password,
        full_name,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create user");
      }

      return {
        user: result.user,
      };
    },
  });
};
