"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SettingsProvider } from "./settings_context";
import { BusinessProfileSettings } from "./business_profile_settings";
import { OperatingHoursSettings } from "./operating_hours_settings";
import { PayoutMethodsSettings } from "./payout_methods_settings";
import { SecurityAccountSettings } from "./security_account_settings";
import { BusinessProfileCard } from "./business_profile_card";
import { ServicesCatalogSettings } from "./services_settings/services_catalog_settings";

const SETTINGS_SECTIONS = [
  {
    id: "business-profile",
    title: "Business Profile",
    component: BusinessProfileSettings,
  },
  {
    id: "service-catalog",
    title: "Service Catalog",
    component: ServicesCatalogSettings,
  },
  {
    id: "operating-hours",
    title: "Operating Hours",
    component: OperatingHoursSettings,
  },
  {
    id: "payout-methods",
    title: "Payout Methods",
    component: PayoutMethodsSettings,
  },
  {
    id: "security-account",
    title: "Security & Account",
    component: SecurityAccountSettings,
  },
] as const;

export const SettingsPageUI = () => {
  return (
    <SettingsProvider>
      <div className="flex  flex-col lg:flex-row gap-8 p-6 ">
        <BusinessProfileCard />
        <div className="flex flex-col gap-7  p-4 flex-1 w-full">
          <Accordion type="single" collapsible defaultValue="business-profile">
            {SETTINGS_SECTIONS.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="bg-card rounded-2xl p-6 mb-4 border-none"
              >
                <AccordionTrigger className="py-1 hover:no-underline">
                  <span className="font-manrope font-medium text-lg text-foreground">
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

export default SettingsPageUI;
