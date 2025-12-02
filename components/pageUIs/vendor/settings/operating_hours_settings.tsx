"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSettings } from "./settings_context";
import { Button } from "@/components/ui/button";
import { DAYS, DayKey } from "./settings_utils";
import { cn } from "@/lib/utils";
import { Plus, X, ArrowRight } from "lucide-react";

export const OperatingHoursSettings = () => {
  const { operating_hours_form, onUpdateOperatingHours } = useSettings();

  const handleSubmit = operating_hours_form.handleSubmit(
    onUpdateOperatingHours
  );

  return (
    <Form {...operating_hours_form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Days Schedule */}
        <div className="flex flex-col gap-2">
          {DAYS.map((day) => (
            <DayRow key={day.key} dayKey={day.key} label={day.label} />
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            className="bg-[#f5c555] hover:bg-[#f5c555]/90 text-[#1a1a1a] rounded-lg px-4 py-3 w-[252px]"
          >
            Update
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
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
  const { operating_hours_form } = useSettings();
  const dayValue = operating_hours_form.watch(dayKey);
  const isAvailable = dayValue !== undefined && dayValue !== null;

  const handleAddHours = () => {
    operating_hours_form.setValue(dayKey, {
      start_time: "09:00",
      end_time: "17:00",
    });
  };

  const handleRemoveHours = () => {
    operating_hours_form.setValue(dayKey, undefined);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        {/* Day Label */}
        <span className="font-manrope text-sm text-[#5e5e5e] w-10 shrink-0">
          {label}
        </span>

        {isAvailable ? (
          <>
            {/* Time Inputs with FormField */}
            <div className="flex items-center gap-1.5">
              <FormField
                control={operating_hours_form.control}
                name={`${dayKey}.start_time`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="time"
                        {...field}
                        value={field.value || "09:00"}
                        className={cn(
                          "px-4 py-3 rounded-2xl border border-black/20 text-sm text-[#c9ccd2] bg-white/80",
                          "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
                          "w-[90px]",
                          fieldState.error && "border-destructive"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="text-[#5e5e5e]">-</span>
              <FormField
                control={operating_hours_form.control}
                name={`${dayKey}.end_time`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="time"
                        {...field}
                        value={field.value || "17:00"}
                        className={cn(
                          "px-4 py-3 rounded-2xl border border-black/20 text-sm text-[#c9ccd2] bg-white/80",
                          "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
                          "w-[90px]",
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

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddHours}
              className="p-1 text-[#5e5e5e] hover:text-foreground transition-colors"
            >
              <Plus size={16} />
            </button>
          </>
        ) : (
          <>
            {/* Unavailable State */}
            <span className="text-sm text-[#c9ccd2]">Unavailable</span>
            <button
              type="button"
              onClick={handleAddHours}
              className="p-1 text-[#5e5e5e] hover:text-foreground transition-colors"
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
            control={operating_hours_form.control}
            name={`${dayKey}.start_time`}
            render={() => <FormMessage />}
          />
          <FormField
            control={operating_hours_form.control}
            name={`${dayKey}.end_time`}
            render={() => <FormMessage />}
          />
        </div>
      )}
    </div>
  );
};
