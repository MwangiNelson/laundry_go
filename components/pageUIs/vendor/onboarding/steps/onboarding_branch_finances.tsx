"use client";

import { BasicInput } from "@/components/fields/inputs/basic_input";
import { Form } from "@/components/ui/form";
import { useOnboarding } from "../onboarding_context";
import { TBranchFinances } from "../onboarding_utils";

export const OnboardingBranchFinances = () => {
  const { branch_finances_form } = useOnboarding();

  return (
    <Form {...branch_finances_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Finances
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            Add how LaundryGo should pay this branch.
          </p>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <p className="mb-3 text-sm font-semibold text-title">Bank details</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <BasicInput<TBranchFinances>
              control={branch_finances_form.control}
              name="bank_name"
              label="Bank name"
              placeholder="Enter Bank Name"
              className="rounded-lg px-3 py-2"
            />
            <BasicInput<TBranchFinances>
              control={branch_finances_form.control}
              name="bank_account_name"
              label="Account name"
              placeholder="LaundryGo Hub Ltd"
              className="rounded-lg px-3 py-2"
            />
            <BasicInput<TBranchFinances>
              control={branch_finances_form.control}
              name="bank_account_number"
              label="Account number"
              placeholder="0123456789"
              className="rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
