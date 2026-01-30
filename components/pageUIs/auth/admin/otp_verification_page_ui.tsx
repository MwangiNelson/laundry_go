"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AuthSharedPageUI from "./auth_shared_page_ui";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useResendRecoveryOtp, useVerifyOtp } from "@/api/auth/use_auth";
import { useRouter } from "next/navigation";

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the complete OTP"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export const OtpVerificationPageUI = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(59);
  const { mutateAsync: verifyOtp, isPending } = useVerifyOtp();
  const sendRecoveryEmailMutation = useResendRecoveryOtp();
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpFormValues) => {
    await verifyOtp({ access_token: data.otp }).then(() => {
      router.push("/auth/set-new-password");
    });
  };

  const handleResend = () => {
    setCountdown(59);
    return;
    sendRecoveryEmailMutation.mutateAsync({
      email: localStorage.getItem("recovery_email") || "",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <AuthSharedPageUI>
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-4">
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight text-title">
              OTP Verification
            </h1>
            <p className="text-sm leading-normal text-secondary">
              Check your email to see the verification code
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex justify-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup className="gap-3">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="size-12 rounded-full border-border text-foreground text-sm"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                loading={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 h-auto text-sm font-normal"
              >
                Verify
              </Button>
            </form>
          </Form>

          {/* Resend Timer */}
          <div className="flex items-center justify-center gap-1.5 text-sm">
            <span className="text-label">Resend code in</span>
            {countdown > 0 ? (
              <span className="text-link">{formatTime(countdown)}</span>
            ) : (
              <button
                onClick={handleResend}
                className="text-link hover:underline"
              >
                Resend
              </button>
            )}
          </div>
        </div>
      </div>
    </AuthSharedPageUI>
  );
};
