"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import { useSettings } from "./settings_context";
import { PasswordInput } from "@/components/fields/inputs/password_input";
import { Button } from "@/components/ui/button";
import { TSecurityAccount } from "./settings_utils";
import { ArrowRight } from "lucide-react";

export const SecurityAccountSettings = () => {
  const { security_account_form, onUpdateSecurityAccount } = useSettings();

  const handleSubmit = security_account_form.handleSubmit(
    onUpdateSecurityAccount
  );

  return (
    <Form {...security_account_form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Change Password Section */}
        <div className="flex flex-col gap-4">
          <h4 className="font-manrope text-base font-medium text-[#1a1a1a]">
            Change Password
          </h4>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PasswordInput<TSecurityAccount>
              control={security_account_form.control}
              name="current_password"
              label="Current Password"
              placeholder="Enter current password"
            />
            <PasswordInput<TSecurityAccount>
              control={security_account_form.control}
              name="new_password"
              label="New Password"
              placeholder="Enter new password"
            />
            <PasswordInput<TSecurityAccount>
              control={security_account_form.control}
              name="confirm_password"
              label="Confirm Password"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            className="bg-[#f5c555] hover:bg-[#f5c555]/90 text-[#1a1a1a] rounded-lg px-4 py-3 w-[252px]"
          >
            Update
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
