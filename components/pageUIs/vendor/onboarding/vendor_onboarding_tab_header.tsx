"use client";
import { CheckIcon } from "@phosphor-icons/react";
import React from "react";
import { useOnboarding } from "./onboarding_context";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Business Information",
  "Services & Pricing",
  "Operations Setup",
];

export const VendorOnboardingTabHeader = () => {
  const { current_step, set_current_step, completed_steps, steps } =
    useOnboarding();

  const handleStepClick = (index: number) => {
    const isFirstStep = index === 0;
    const isCurrentStep = index === current_step;
    const isCompletedStep = completed_steps.includes(index);
    const isNextStep = index === current_step + 1;
    const isCurrentStepCompleted = completed_steps.includes(current_step);

    const isDisabled =
      !isFirstStep &&
      !isCurrentStep &&
      !isCompletedStep &&
      !(isNextStep && isCurrentStepCompleted);

    if (!isDisabled) {
      set_current_step(index);
    }
  };

  return (
    <div className="bg-background rounded-xl px-6 py-5 flex flex-col gap-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]">
      <h2 className="font-manrope font-extrabold text-2xl leading-[1.4] text-title">
        Complete Your Profile
      </h2>

      <div className="flex items-start justify-center gap-2 sm:gap-6 md:gap-[50px] w-full px-0 sm:px-6">
        {steps.map((step, index) => {
          const isCompleted = completed_steps.includes(index);
          const isActive = index === current_step;
          const isFirstStep = index === 0;
          const isCompletedStep = completed_steps.includes(index);
          const isNextStep = index === current_step + 1;
          const isCurrentStepCompleted = completed_steps.includes(current_step);

          const isDisabled =
            !isFirstStep &&
            !isActive &&
            !isCompletedStep &&
            !(isNextStep && isCurrentStepCompleted);

          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <button
                type="button"
                onClick={() => handleStepClick(index)}
                disabled={isDisabled}
                className={cn(
                  "flex flex-col items-center gap-2.5 min-w-8 transition-opacity",
                  isDisabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:opacity-80"
                )}
              >
                <StepIndicator
                  stepNumber={index + 1}
                  isCompleted={isCompleted}
                  isActive={isActive}
                />
                <span
                  className={cn(
                    "font-manrope text-xs text-center tracking-[0.5px] leading-[1.4] whitespace-nowrap",
                    isCompleted
                      ? "font-bold text-secondary"
                      : isActive
                      ? "font-bold text-foreground       "
                      : "font-normal text-muted-foreground"
                  )}
                >
                  {STEP_LABELS[index]}
                </span>
              </button>

              {!isLastStep && <StepTrail isCompleted={isCompleted} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  stepNumber: number;
  isCompleted: boolean;
  isActive: boolean;
}

const StepIndicator = ({
  stepNumber,
  isCompleted,
  isActive,
}: StepIndicatorProps) => {
  if (isCompleted) {
    return (
      <div className="size-8 rounded-full flex items-center justify-center ">
        <CheckIcon size={20} weight="bold" className="text-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "size-8 rounded-full  flex items-center justify-center",
        isActive ? "bg-[#68C8FF]" : "border ",
        isCompleted ? "bg-[#68C8FF]" : ""
      )}
    >
      <span
        className={cn(
          "font-manrope text-sm leading-normal text-center",
          isActive ? "text-primary-purple font-medium" : "text-muted-foreground"
        )}
      >
        {String(stepNumber).padStart(2, "0")}
      </span>
    </div>
  );
};

interface StepTrailProps {
  isCompleted: boolean;
}

const StepTrail = ({ isCompleted }: StepTrailProps) => {
  return (
    <div className="flex-1 h-8 flex items-center min-w-7">
      <div className={cn("h-0.5 w-full bg-[#68C8FF]")} />
    </div>
  );
};
