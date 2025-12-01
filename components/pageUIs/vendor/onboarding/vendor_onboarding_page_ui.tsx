"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { VendorOnboardingTabHeader } from "./vendor_onboarding_tab_header";
import { useOnboarding } from "./onboarding_context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const VendorOboardingPageUI = () => {
  const {
    StepComponent,
    steps,
    is_open,
    set_is_open,
    discard,
    is_in_last_step,
    handleNextStep,
    current_step,
    set_current_step,
    completed_steps,
    handleback,
    handleSubmit,
  } = useOnboarding();
  const handleNext = async () => {
    const isValid = await steps[current_step].form.trigger();

    console.log({
      "form values": steps[current_step].form.getValues(),
      isValid,
    });
    if (isValid) {
      handleNextStep();
    } else {
      toast.error("Please fix the errors in the form before proceeding.");
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden relative flex items-center justify-center">
      {/* Background - fixed to viewport */}
      <Image
        src={`/vendors/auth/bg.png`}
        alt="Background Image"
        fill
        className="object-cover -z-10"
      />

      {/* Modal-like card container */}
      <div className="w-[90vw] max-w-[800px] max-h-[90vh] flex flex-col gap-4">
        <VendorOnboardingTabHeader />
        <Card className="rounded-xl bg-background px-6 py-6 border-t-0 flex flex-col flex-1 min-h-0">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-2">
            <StepComponent />
          </div>

          {/* Fixed footer buttons */}
          <div className="flex justify-between pt-6 mt-4 border-t shrink-0">
            <Button
              variant="ghost"
              onClick={handleback}
              disabled={current_step === 0}
              className="px-12 bg-foreground/5 hover:bg-foreground/10 rounded-lg"
            >
              Back
            </Button>
            <Button onClick={handleNext} className="px-12 rounded-lg">
              {is_in_last_step ? "Finish" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
