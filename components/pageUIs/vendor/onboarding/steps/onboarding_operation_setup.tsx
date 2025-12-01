"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useOnboarding } from "../onboarding_context";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

const DAYS = [
  { key: "sunday", label: "Sun" },
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

export const OnboardingOperationSetup = () => {
  const { operation_hours_form } = useOnboarding();

  return (
    <Form {...operation_hours_form}>
      <form className="flex flex-col gap-4">
        {/* Title Section */}
        <div className="flex flex-col gap-2">
          <h2 className="font-manrope font-bold text-2xl md:text-[32px] leading-tight text-title">
            Operations Setup
          </h2>
          <p className="font-manrope text-sm leading-normal text-subtitle">
            Set up your availability schedule to help customers know when to
            assign orders or contact you for your services. This program will
            show up on the customers&apos; app.
          </p>
        </div>

        {/* Days Schedule */}
        <div className="flex flex-col gap-3">
          {DAYS.map((day) => (
            <DayRow key={day.key} dayKey={day.key} label={day.label} />
          ))}
        </div>
      </form>
    </Form>
  );
};

interface DayRowProps {
  dayKey: DayKey;
  label: string;
}

const DayRow = ({ dayKey, label }: DayRowProps) => {
  const { operation_hours_form } = useOnboarding();
  const dayValue = operation_hours_form.watch(dayKey);
  const isAvailable = dayValue !== undefined && dayValue !== null;

  const handleAddHours = () => {
    operation_hours_form.setValue(dayKey, {
      start_time: "09:00",
      end_time: "17:00",
    });
  };

  const handleRemoveHours = () => {
    operation_hours_form.setValue(dayKey, undefined);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        {/* Day Label */}
        <span className="font-manrope text-sm text-foreground w-10 shrink-0">
          {label}
        </span>

        {isAvailable ? (
          <>
            {/* Time Inputs with FormField */}
            <div className="flex items-center gap-2">
              <FormField
                control={operation_hours_form.control}
                name={`${dayKey}.start_time`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="time"
                        {...field}
                        value={field.value || "09:00"}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm text-foreground bg-transparent",
                          "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
                          "w-[110px]",
                          fieldState.error && "border-destructive"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="text-muted-foreground">-</span>
              <FormField
                control={operation_hours_form.control}
                name={`${dayKey}.end_time`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="time"
                        {...field}
                        value={field.value || "17:00"}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm text-foreground bg-transparent",
                          "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
                          "w-[110px]",
                          fieldState.error && "border-destructive"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemoveHours}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            {/* Unavailable State */}
            <span className="text-sm text-muted-foreground">Unavailable</span>
            <button
              type="button"
              onClick={handleAddHours}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus size={16} />
            </button>
          </>
        )}
      </div>

      {/* Error Messages for this day */}
      {isAvailable && (
        <div className="ml-14 flex gap-4">
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
