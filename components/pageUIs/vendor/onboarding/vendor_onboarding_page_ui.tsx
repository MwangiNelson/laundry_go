"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOnboarding } from "./onboarding_context";
import { VendorOnboardingNavbar } from "./vendor_onboarding_navbar";
import { VendorOnboardingFooter } from "./vendor_onboarding_footer";
import { VendorOnboardingTabHeader } from "./vendor_onboarding_tab_header";

export const VendorOboardingPageUI = () => {
  const {
    StepComponent,
    steps,
    is_in_last_step,
    handleNextStep,
    current_step,
    handleback,
    saving_step,
    loading_page,
    existing_vendor,
    profile_is_complete,
  } = useOnboarding();

  const handleNext = async () => {
    const isValid = await steps[current_step].form.trigger();

    if (!isValid) {
      toast.error("Please fix the highlighted fields before you continue.");
      return;
    }

    try {
      await handleNextStep();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not save this step. Please try again.";
      toast.error(message);
    }
  };

  if (loading_page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
        <div className="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing your onboarding workspace...
        </div>
      </div>
    );
  }



  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb] text-foreground">
      <VendorOnboardingNavbar />
      <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <VendorOnboardingTabHeader />

          <div className="rounded-2xl border border-border bg-white p-4 sm:p-6">
            <StepComponent />

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
              <Button
                variant="outline"
                onClick={handleback}
                disabled={current_step === 0 || saving_step}
                className="h-10 min-w-[120px] rounded-xl px-6"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="h-10 min-w-[120px] rounded-xl bg-landing-accent px-6 text-title hover:bg-landing-accent/90"
                loading={saving_step}
              >
                {is_in_last_step
                  ? profile_is_complete
                    ? "Save changes"
                    : "Complete"
                  : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <VendorOnboardingFooter />
    </div>
  );
};
