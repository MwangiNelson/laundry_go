"use client";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useOnboarding } from "../onboarding_context";

const DAYS = [
  { key: "sunday", label: "Sun" },
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
] as const;

type TDayKey = (typeof DAYS)[number]["key"];

export const OnboardingOperationSetup = () => {
  const { operation_hours_form } = useOnboarding();

  return (
    <Form {...operation_hours_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Operations Setup
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            Set up your availability schedule to help customers know when to
            assign orders or contact you for your services. This program will
            show up on the customers&apos; app.
          </p>
        </div>

        <div className="divide-y divide-border rounded-2xl border border-border">
          {DAYS.map((day) => (
            <DayRow key={day.key} dayKey={day.key} label={day.label} />
          ))}
        </div>
      </form>
    </Form>
  );
};

const DayRow = ({ dayKey, label }: { dayKey: TDayKey; label: string }) => {
  const { operation_hours_form } = useOnboarding();
  const dayValue = operation_hours_form.watch(dayKey);
  const isEnabled = Boolean(dayValue?.start_time && dayValue?.end_time);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <p className="w-10 text-sm font-medium text-title">{label}</p>

      {isEnabled ? (
        <>
          <TimeField
            name={`${dayKey}.start_time`}
            defaultValue={dayValue?.start_time ?? "09:00"}
          />
          <span className="text-xs text-muted-foreground">-</span>
          <TimeField
            name={`${dayKey}.end_time`}
            defaultValue={dayValue?.end_time ?? "17:00"}
          />
          <button
            type="button"
            onClick={() => operation_hours_form.setValue(dayKey, undefined)}
            className="ml-1 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${label} hours`}
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <span className="text-sm text-muted-foreground">Unavailable</span>
          <button
            type="button"
            onClick={() =>
              operation_hours_form.setValue(dayKey, {
                start_time: "09:00",
                end_time: "17:00",
              })
            }
            className="text-muted-foreground hover:text-title"
          >
            <Plus className="h-4 w-4" />
          </button>
        </>
      )}

      {isEnabled && (
        <div className="hidden">
          <FormField
            control={operation_hours_form.control}
            name={`${dayKey}.start_time`}
            render={() => <FormMessage />}
          />
          <FormField
            control={operation_hours_form.control}
            name={`${dayKey}.end_time`}
            render={() => <FormMessage />}
          />
        </div>
      )}
    </div>
  );
};

const TimeField = ({
  name,
  defaultValue,
}: {
  name: `${TDayKey}.start_time` | `${TDayKey}.end_time`;
  defaultValue: string;
}) => {
  const { operation_hours_form } = useOnboarding();

  return (
    <FormField
      control={operation_hours_form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <input
              type="time"
              {...field}
              value={field.value || defaultValue}
              className={cn(
                "h-8 w-[100px] rounded-lg border border-border bg-white px-2 text-sm text-title outline-none focus:border-landing-primary",
                fieldState.error && "border-destructive"
              )}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
