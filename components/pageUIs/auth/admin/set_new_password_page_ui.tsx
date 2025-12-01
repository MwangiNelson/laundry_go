"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import AuthSharedPageUI from "./auth_shared_page_ui";
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

export const SetNewPasswordPageUI = () => {
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
    <AuthSharedPageUI>
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight text-title">
              Set New Password
            </h1>
            <p className="text-sm leading-normal text-subtitle text-secondary">
              Enter your new password to complete the reset process
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-4">
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

              <Button
                type="submit"
                loading={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 h-auto text-sm font-normal"
              >
                Save New Password
              </Button>
            </form>
          </Form>

          {/* Back to Sign In Link */}
          <div className="flex items-center justify-center gap-1.5 text-sm">
            <span className="text-label">Remember old password?</span>
            <Link href="/auth/signin" className="text-link hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthSharedPageUI>
  );
};
