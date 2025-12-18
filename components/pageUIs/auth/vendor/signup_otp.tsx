"use client";
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
import { useConfirmEmailOtp } from "@/api/auth/use_auth";

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the complete OTP"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export const SignUpOTP = () => {
  const { mutateAsync: confirmEmail, isPending } = useConfirmEmailOtp();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: OtpFormValues) => {
    const email = localStorage.getItem("signup_email") || "";
    if (!email) {
      console.error("No email found in localStorage");
      return;
    }
    confirmEmail({ email, token: data.otp });
  };

  return (
    <VendorAuthPageUI activeSlide={1}>
      <div className="flex flex-col gap-10">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h1 className="font-manrope font-bold text-[32px] leading-tight text-title">
            Confirm your Email
          </h1>
          <p className="font-manrope text-[14px] leading-normal text-subtitle">
            Enter the OTP sent to your email to verify your account.
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
            </div>
          </form>
        </Form>
      </div>
    </VendorAuthPageUI>
  );
};
