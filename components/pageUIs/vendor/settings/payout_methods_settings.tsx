"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import { useSettings } from "./settings_context";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { Button } from "@/components/ui/button";
import { TPayoutMethods } from "./settings_utils";
import { ArrowRight } from "lucide-react";

export const PayoutMethodsSettings = () => {
  const { payout_methods_form, onUpdatePayoutMethods } = useSettings();

  const handleSubmit = payout_methods_form.handleSubmit(onUpdatePayoutMethods);

  return (
    <Form {...payout_methods_form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Bank Transfer Section */}
        <div className="flex flex-col gap-1.5">
          <h4 className="font-manrope text-base text-[#1a1a1a]">
            Bank Transfer
          </h4>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BasicInput<TPayoutMethods>
              control={payout_methods_form.control}
              name="bank_name"
              label="Bank Name"
              placeholder="service name"
            />
            <BasicInput<TPayoutMethods>
              control={payout_methods_form.control}
              name="account_name"
              label="Account Name"
              placeholder="service name"
            />
            <BasicInput<TPayoutMethods>
              control={payout_methods_form.control}
              name="account_number"
              label="Account Number"
              placeholder="service name"
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
