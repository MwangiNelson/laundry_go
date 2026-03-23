"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SettingsProvider } from "@/components/pageUIs/vendor/settings/settings_context";
import { BusinessProfileCard } from "@/components/pageUIs/vendor/settings/business_profile_card";
import { ServicesCatalogSettings } from "@/components/pageUIs/vendor/settings/services_settings/services_catalog_settings";
import { OperatingHoursSettings } from "@/components/pageUIs/vendor/settings/operating_hours_settings";
import { PayoutMethodsSettings } from "@/components/pageUIs/vendor/settings/payout_methods_settings";
import { useVendor } from "@/components/context/vendors/vendor_provider";

type Section = {
  id: string;
  title: string;
  component: React.ComponentType;
};

const INDIVIDUAL_SECTIONS: Section[] = [
  {
    id: "service-catalog",
    title: "Services & Pricing",
    component: ServicesCatalogSettings,
  },
  {
    id: "operating-hours",
    title: "Operations Setup",
    component: OperatingHoursSettings,
  },
  {
    id: "payout-methods",
    title: "Finances & Terms",
    component: PayoutMethodsSettings,
  },
];

const MULTI_BRANCH_SECTIONS: Section[] = [
  {
    id: "service-catalog",
    title: "Services & Pricing",
    component: ServicesCatalogSettings,
  },
];

export const VendorProfilePageUI = () => {
  const { vendor } = useVendor();
  const isMultiBranch = vendor?.business_type === "multi_branch";
  const sections = isMultiBranch ? MULTI_BRANCH_SECTIONS : INDIVIDUAL_SECTIONS;

  return (
    <SettingsProvider>
      <div className="flex flex-col gap-8 p-6 lg:flex-row">
        <BusinessProfileCard />
        <div className="flex w-full flex-1 flex-col gap-7 p-4">
          <Accordion type="single" collapsible defaultValue="service-catalog">
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="mb-4 rounded-2xl border-none bg-card p-6"
              >
                <AccordionTrigger className="py-1 hover:no-underline">
                  <span className="font-manrope text-lg font-medium text-foreground">
                    {section.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <section.component />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SettingsProvider>
  );
};
