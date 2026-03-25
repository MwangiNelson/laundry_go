import { LandingPageUI } from "@/components/pageUIs/landing/landing_page_ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LaundryGo!",
  description:
    "Grow your laundry business with LaundryGo! Manage orders, pricing, and customer communication from one responsive vendor dashboard.",
};

export default function Home() {
  return <LandingPageUI />;
}
