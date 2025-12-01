"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import VendorAuthPageUI from "./vendor_auth_page_ui";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/fields/inputs/password_input";
import { Button } from "@/components/ui/button";
import { useSetNewPassword } from "@/api/auth/use_auth";

const setNewPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SetNewPasswordFormValues = z.infer<typeof setNewPasswordSchema>;

export const VendorSetNewPasswordPageUI = () => {
  const { mutateAsync, isPending } = useSetNewPassword();
  const form = useForm<SetNewPasswordFormValues>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SetNewPasswordFormValues) => {
    mutateAsync({
      password: data.password,
    });
  };

  return (
    <VendorAuthPageUI activeSlide={2}>
      <div className="flex flex-col gap-10">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h1 className="font-manrope font-bold text-[32px] leading-tight text-title">
            Set New Password
          </h1>
          <p className="font-manrope text-[14px] leading-normal text-subtitle">
            Enter your new password to complete the reset process
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-5">
              <PasswordInput
                name="password"
                control={form.control}
                label="Password"
                placeholder="Set your password"
              />
              <PasswordInput
                name="confirmPassword"
                control={form.control}
                label="Confirm Password"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                loading={isPending}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground font-manrope text-[14px] rounded-lg"
              >
                Save New Password
              </Button>

              {/* Back to Sign In Link */}
              <div className="flex items-center justify-center gap-1 text-[14px]">
                <span className="text-muted-foreground">
                  Remember old password?
                </span>
                <Link
                  href="/auth/vendor/signin"
                  className="font-medium text-primary-blue hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </VendorAuthPageUI>
  );
};

export default VendorSetNewPasswordPageUI;
