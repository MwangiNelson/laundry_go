import { LandingPageUI } from "@/components/pageUIs/landing/landing_page_ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing",
  description:
    "LaundryGo vendor landing page with onboarding details, product features, testimonials, and FAQs.",
};

export default function LandingPage() {
  return <LandingPageUI />;
}
