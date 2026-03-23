"use client";

import { Check } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useOnboarding } from "./onboarding_context";

export const VendorOnboardingTabHeader = () => {
  const {
    current_step,
    set_current_step,
    completed_steps,
    steps,
    canNavigateToStep,
  } = useOnboarding();

  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4 sm:px-6">
      <h1 className="font-dm-sans text-lg font-semibold text-title sm:text-xl">
        Complete Your Profile
      </h1>

      <div className="mt-4 flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completed_steps.includes(index);
          const isActive = index === current_step;
          const isDisabled = !canNavigateToStep(index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.key}>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => set_current_step(index)}
                className={cn(
                  "flex flex-col items-center gap-1.5",
                  isDisabled && "cursor-not-allowed opacity-60"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                    isCompleted
                      ? "border-landing-primary bg-landing-primary text-white"
                      : isActive
                        ? "border-landing-primary text-landing-primary"
                        : "border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-center text-[11px] leading-tight sm:block",
                    isActive
                      ? "font-semibold text-title"
                      : isCompleted
                        ? "font-medium text-title"
                        : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </button>
              {!isLast && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full sm:mx-2",
                    isCompleted
                      ? "bg-landing-primary"
                      : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
