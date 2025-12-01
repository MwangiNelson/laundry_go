"use client";

import React from "react";
import Link from "next/link";

import VendorAuthPageUI from "./vendor_auth_page_ui";
import { Button } from "@/components/ui/button";

export const VendorPasswordSuccessPageUI = () => {
  return (
    <VendorAuthPageUI activeSlide={2}>
      <div className="flex flex-col gap-10">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h1 className="font-manrope font-bold text-[32px] leading-tight text-title">
            Your Password Successfully Changed
          </h1>
          <p className="font-manrope text-[14px] leading-normal text-subtitle">
            Sign in to your account with your new password
          </p>
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground font-manrope text-[14px] rounded-lg"
        >
          <Link href="/auth/vendor/signin">Sign in</Link>
        </Button>
      </div>
    </VendorAuthPageUI>
  );
};

export default VendorPasswordSuccessPageUI;
