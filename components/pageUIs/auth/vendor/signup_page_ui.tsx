"use client";
import React from "react";
import VendorAuthPageUI from "./vendor_auth_page_ui";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PasswordInput } from "@/components/fields/inputs/password_input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useVendorSignUpWithEmail } from "@/api/vendor/use_vendor_auth";

const schema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms of use and privacy policy",
  }),
});

const SignUpPageUI = () => {
  const { mutateAsync: signUpWithEmail, isPending } =
    useVendorSignUpWithEmail();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });
  const onSubmit = async (data: z.infer<typeof schema>) => {
    await signUpWithEmail({
      email: data.email,
      password: data.password,
      full_name: data.username,
    });
  };
  return (
    <VendorAuthPageUI>
      <Form {...form}>
        <form
          className="flex flex-col gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="font-manrope font-bold text-[32px] leading-tight text-title">
              Get Started Now
            </h1>
            <p className="font-manrope text-[14px] leading-normal text-subtitle">
              Let&apos;s create your account
            </p>
          </div>

          {/* Form Fields & Actions */}
          <div className="flex flex-col justify-between gap-8">
            {/* Input Fields */}
            <div className="flex flex-col gap-5">
              <BasicInput
                control={form.control}
                name="username"
                label="Username"
                placeholder="Enter name"
              />
              <BasicInput
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="email@email.com"
                type="email"
              />
              <PasswordInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Set your password"
              />

              {/* Terms & Privacy Policy Checkbox */}
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="agreeToTerms"
                  checked={form.watch("agreeToTerms")}
                  onCheckedChange={(checked) =>
                    form.setValue("agreeToTerms", checked as boolean)
                  }
                  className="size-4 mt-0.5 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="font-dm-sans text-xs text-foreground cursor-pointer leading-normal"
                >
                  I have read and agree to the platforms{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-secondary underline"
                  >
                    terms of use
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-secondary underline"
                  >
                    privacy policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col gap-3">
              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground font-manrope text-sm rounded-lg"
                loading={isPending}
              >
                Sign Up
              </Button>

              {/* <div className="flex items-center gap-2.5">
                <div className="flex-1 h-px bg-border" />
                <span className="font-normal text-[14px] text-foreground">
                  or
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-primary text-foreground font-manrope text-[14px] rounded-lg hover:bg-primary/10 gap-2"
              >
                <Image
                  src="/auth/google.svg"
                  alt="Google"
                  width={14}
                  height={15}
                />
                Sign up with Google
              </Button> */}
            </div>

            {/* Sign In Link */}
            <div className="flex items-center justify-center gap-1 text-[14px]">
              <span className="text-muted-foreground">
                Already have an account?
              </span>
              <Link
                href="/auth/vendor/signin"
                className="font-medium text-secondary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </VendorAuthPageUI>
  );
};

export default SignUpPageUI;
