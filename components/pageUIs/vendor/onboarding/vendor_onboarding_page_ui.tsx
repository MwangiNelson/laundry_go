"use client";

import Image from "next/image";
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
      <div className="flex min-h-screen flex-col bg-[#f4f7fb] text-foreground">
        <VendorOnboardingNavbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <Image
            src="/logos/main.svg"
            alt="LaundryGo!"
            width={202}
            height={47}
            className="mb-8 h-auto w-[180px]"
            priority
          />

          <div className="mb-6 flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3 text-sm text-muted-foreground shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-landing-primary" />
            Preparing your onboarding workspace...
          </div>

          <div className="mx-auto max-w-md space-y-4 text-center">
            <h2 className="text-lg font-semibold text-title">
              Welcome to LaundryGo for Business
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You&apos;re moments away from joining Kenya&apos;s fastest-growing
              laundry platform. Set up your services, pricing, and operations
              &mdash; and start receiving orders from customers near you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-landing-accent/15 px-3 py-1 font-medium text-title">
                Easy Setup
              </span>
              <span className="rounded-full bg-landing-primary/10 px-3 py-1 font-medium text-title">
                Real-time Orders
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-title">
                Fast Payouts
              </span>
            </div>
          </div>
        </main>
        <VendorOnboardingFooter />
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
