"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import AuthSharedPageUI from "./auth_shared_page_ui";
import { Form } from "@/components/ui/form";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { Button } from "@/components/ui/button";
import { useResendRecoveryOtp } from "@/api/auth/use_auth";
import { useRouter } from "next/navigation";
// import { useSendRecoveryEmail } from "@/api/auth/use_auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPageUI = () => {
  const router = useRouter();
  const sendRecoveryEmailMutation = useResendRecoveryOtp();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await sendRecoveryEmailMutation
      .mutateAsync({ email: data.email })
      .then(() => {
        localStorage.setItem("recovery_email", data.email);
        router.push("/auth/otp-verification");
      });
  };
  return (
    <AuthSharedPageUI>
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-4">
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight text-title">
              Forgot Password
            </h1>
            <p className="text-sm leading-normal text-subtitle text-secondary">
              Enter your email to reset your password
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-4">
                <BasicInput
                  name="email"
                  control={form.control}
                  label="Email Address"
                  placeholder="email@email.com"
                />
              </div>

              <Button
                type="submit"
                loading={sendRecoveryEmailMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 h-auto text-sm font-normal"
              >
                Submit
              </Button>
            </form>
          </Form>

          {/* Back to Sign In Link */}
          <div className="flex items-center justify-center gap-1.5 text-sm">
            <span className="text-label">Remember your password?</span>
            <Link href="/auth/signin" className="text-link hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthSharedPageUI>
  );
};
