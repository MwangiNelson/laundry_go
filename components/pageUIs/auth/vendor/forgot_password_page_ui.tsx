"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import VendorAuthPageUI from "./vendor_auth_page_ui";
import { Form } from "@/components/ui/form";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { Button } from "@/components/ui/button";
import { useSendRecoveryEmail } from "@/api/auth/use_auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const VendorForgotPasswordPageUI = () => {
  const sendRecoveryEmailMutation = useSendRecoveryEmail();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    sendRecoveryEmailMutation.mutateAsync({ email: data.email });
  };

  return (
    <VendorAuthPageUI activeSlide={1}>
      <div className="flex flex-col gap-10">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h1 className="font-manrope font-bold text-[32px] leading-tight text-title">
            Forgot Password
          </h1>
          <p className="font-manrope text-[14px] leading-normal text-subtitle">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-5">
              <BasicInput
                name="email"
                control={form.control}
                label="Email Address"
                placeholder="email@email.com"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                loading={sendRecoveryEmailMutation.isPending}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground font-manrope text-[14px] rounded-lg"
              >
                Submit
              </Button>

              {/* Back to Sign In Link */}
              <div className="flex items-center justify-center gap-1 text-[14px]">
                <span className="text-muted-foreground">
                  Remember your password?
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

export default VendorForgotPasswordPageUI;
