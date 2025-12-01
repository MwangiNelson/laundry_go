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

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});
const SignInPageUI = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  return (
    <VendorAuthPageUI>
      <Form {...form}>
        <form className="flex flex-col gap-10">
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="font-manrope font-bold text-[32px] leading-tight text-title">
              Welcome Back
            </h1>
            <p className="font-manrope text-[14px] leading-normal text-subtitle">
              Sign in to your account
            </p>
          </div>

          {/* Form Fields & Actions */}
          <div className="flex flex-col justify-between gap-4">
            {/* Input Fields */}
            <div className="flex flex-col gap-5">
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="rememberMe"
                    checked={form.watch("rememberMe")}
                    onCheckedChange={(checked) =>
                      form.setValue("rememberMe", checked as boolean)
                    }
                    className="size-[18px] data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="font-manrope text-sm text-title cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/vendor/forgot-password"
                  className="font-manrope font-bold text-[14px] leading-normal text-secondary hover:underline"
                >
                  Forgot Password
                </Link>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground font-manrope text-sm rounded-lg"
                >
                  Sign In
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="font-normal text-[14px] text-foreground">
                    or
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Alternative Sign In Options */}
                <div className="flex gap-5 flex-col md:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 border-primary text-foreground font-manrope text-[14px] rounded-lg hover:bg-primary/10"
                  >
                    Sign In with Phone Number
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 border-primary text-foreground font-manrope text-[14px] rounded-lg hover:bg-primary/10 gap-2"
                  >
                    <Image
                      src="/auth/google.svg"
                      alt="Google"
                      width={14}
                      height={15}
                    />
                    Sign in with Google
                  </Button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="flex items-center justify-center gap-1 text-[14px]">
                <span className="text-muted-foreground">
                  Don&apos;t Have an Account?
                </span>
                <Link
                  href="/auth/vendor/signup"
                  className="font-medium text-primary-blue hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </VendorAuthPageUI>
  );
};

export default SignInPageUI;
