"use client";

import { BasicInput } from "@/components/fields/inputs/basic_input";
import { GoogleMapsAutocomplete } from "@/components/fields/google_maps/google_auto_complete";
import { Form } from "@/components/ui/form";
import { useOnboarding } from "../onboarding_context";
import { TBranchDetails } from "../onboarding_utils";

export const OnboardingBranchDetails = () => {
  const { branch_details_form, existing_vendor } = useOnboarding();
  const parentName = (existing_vendor as any)?.parent_business_name ?? "";

  return (
    <Form {...branch_details_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Branch Details
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            Confirm your branch name and location.
          </p>
        </div>

        {parentName && (
          <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">
              Parent Business
            </p>
            <p className="text-sm font-semibold text-title">{parentName}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-4">
            <p className="mb-3 text-sm font-semibold text-title">
              Branch Information
            </p>

            <div className="space-y-3">
              <BasicInput<TBranchDetails>
                control={branch_details_form.control}
                name="branch_name"
                label="Branch Name"
                placeholder="e.g. Westlands Branch"
                className="rounded-lg px-3 py-2"
              />

              <GoogleMapsAutocomplete<TBranchDetails>
                control={branch_details_form.control}
                name="location"
                label="Branch Location"
                placeholder="Enter the branch address"
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
