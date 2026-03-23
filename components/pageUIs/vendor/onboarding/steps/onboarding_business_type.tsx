"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Building2, Store } from "lucide-react";
import { useOnboarding } from "../onboarding_context";
import { cn } from "@/lib/utils";

const BUSINESS_TYPES = [
  {
    value: "individual",
    title: "Individual Business",
    description:
      "Manage a single storefront, studio, or service location from one profile.",
    icon: Store,
  },
  {
    value: "multi_branch",
    title: "Multi-branch Business",
    description:
      "Use one main profile while you prepare to manage multiple operating branches.",
    icon: Building2,
  },
] as const;

export const OnboardingBusinessType = () => {
  const { business_type_form } = useOnboarding();

  return (
    <Form {...business_type_form}>
      <form className="flex flex-col gap-4">
        <div>
          <h2 className="font-dm-sans text-xl font-semibold text-title sm:text-2xl">
            Business Type
          </h2>
          <p className="mt-1 text-sm text-landing-primary">
            Choose the profile structure that best matches your business.
          </p>
        </div>

        <FormField
          control={business_type_form.control}
          name="business_type"
          render={({ field }) => (
            <FormItem className="grid gap-3 md:grid-cols-2">
              {BUSINESS_TYPES.map((option) => {
                const Icon = option.icon;
                const selected = field.value === option.value;

                return (
                  <FormControl key={option.value}>
                    <button
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                        selected
                          ? "border-landing-primary bg-landing-primary-faint"
                          : "border-border hover:border-landing-primary/50"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white">
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            selected ? "text-landing-primary" : "text-title"
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-title">
                          {option.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  </FormControl>
                );
              })}
              <FormMessage className="md:col-span-2" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
