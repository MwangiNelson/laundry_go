import { OnboardingProvider } from "@/components/pageUIs/vendor/onboarding/onboarding_context";
import { VendorOboardingPageUI } from "@/components/pageUIs/vendor/onboarding/vendor_onboarding_page_ui";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Vendor Onboarding - LaundryGo!",
  description:
    "Join LaundryGo! as a vendor and expand your laundry business. Complete the onboarding process to get started.",
  keywords: ["Vendor Onboarding", "LaundryGo! Vendor"],
};
const Page = () => {
  return (
    <OnboardingProvider>
      <VendorOboardingPageUI />
    </OnboardingProvider>
  );
};

export default Page;
