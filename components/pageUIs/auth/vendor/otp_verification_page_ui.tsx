"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import VendorAuthPageUI from "./vendor_auth_page_ui";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyOtp } from "@/api/auth/use_auth";

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the complete OTP"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export const VendorOtpVerificationPageUI = () => {
  const [countdown, setCountdown] = useState(59);
  const { mutateAsync: verifyOtp, isPending } = useVerifyOtp();
  // const { mutateAsync: resendRecoveryEmail, isPending: isResending } =
  //   useSendRecoveryEmail();

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

  const onSubmit = (data: OtpFormValues) => {
    verifyOtp({ access_token: data.otp });
  };

  const handleResend = () => {
    setCountdown(59);
    // resendRecoveryEmail({
    //   email: localStorage.getItem("recovery_email") || "",
    // });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <VendorAuthPageUI activeSlide={1}>
      <div className="flex flex-col gap-10">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h1 className="font-manrope font-bold text-[32px] leading-tight text-title">
            OTP Verification
          </h1>
          <p className="font-manrope text-[14px] leading-normal text-subtitle">
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
                      maxLength={8}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup className="gap-3">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
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

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                loading={isPending}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground font-manrope text-[14px] rounded-lg"
              >
                Verify
              </Button>

              {/* Resend Timer */}
              <div className="flex items-center justify-center gap-1 text-[14px]">
                <span className="text-muted-foreground">Resend code in</span>
                {countdown > 0 ? (
                  <span className="font-medium text-foreground">
                    {formatTime(countdown)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    // disabled={isResending}
                    className="font-medium text-primary-blue hover:underline disabled:opacity-50"
                  >
                    {/* {isResending ? "Sending..." : "Resend"} */}
                  </button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </VendorAuthPageUI>
  );
};

export default VendorOtpVerificationPageUI;
