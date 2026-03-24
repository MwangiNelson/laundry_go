import React from "react";
import Link from "next/link";

import AuthSharedPageUI from "./auth_shared_page_ui";
import { Button } from "@/components/ui/button";

export const PasswordSuccessPageUI = ({ next }: { next?: string }) => {
  const signInHref = next?.startsWith("/vendor") ? "/auth/vendor/signin" : "/auth/signin";

  return (
    <AuthSharedPageUI>
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-4">
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight text-title">
              Your Password Successfully Changed
            </h1>
            <p className="text-sm leading-normal text-subtitle text-secondary">
              Sign in to your account with your new password
            </p>
          </div>

          {/* Action Button */}
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 h-auto text-sm font-normal"
          >
            <Link href={signInHref}>Sign in</Link>
          </Button>
        </div>
      </div>
    </AuthSharedPageUI>
  );
};
