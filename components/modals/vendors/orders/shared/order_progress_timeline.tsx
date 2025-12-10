import { Check } from "lucide-react";

interface TimelineStep {
  label: string;
  time: string;
  completed: boolean;
}

interface OrderProgressTimelineProps {
  steps: TimelineStep[];
}

export const OrderProgressTimeline = ({
  steps,
}: OrderProgressTimelineProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 space-y-6">
      <p className="text-sm text-muted-foreground font-normal font-manrope">
        Order Progress Timeline
      </p>
      <div className="relative space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-1.5 items-start relative">
            <div
              className={`${
                step.completed ? "bg-secondary" : "bg-muted"
              } rounded-full p-2 shrink-0 z-10`}
            >
              <Check
                className={`size-6 ${
                  step.completed ? "text-card" : "text-muted-foreground"
                }`}
              />
            </div>
            <div className="flex flex-col gap-1.5 font-manrope font-normal">
              <p
                className={`text-base leading-[1.6] ${
                  step.completed ? "text-secondary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              <p className="text-sm text-muted-foreground leading-[1.5]">
                {step.time}
              </p>
            </div>
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-10 bg-secondary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
