import { CTAFooter } from "@/components/pageUIs/landing/cta_footer";
import { FAQs } from "@/components/pageUIs/landing/faqs";
import { Features } from "@/components/pageUIs/landing/features";
import { Hero } from "@/components/pageUIs/landing/hero";
import { LandingFooter } from "@/components/pageUIs/landing/landing_footer";
import { LandingNavbar } from "@/components/pageUIs/landing/landing_navbar";
import { HowItWorks } from "@/components/pageUIs/landing/how_it_works";
import { Preview } from "@/components/pageUIs/landing/preview";
import { Testimonials } from "@/components/pageUIs/landing/testimonials";

export function LandingPageUI() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFB] font-dm-sans text-title">
      <LandingNavbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Preview />
      <Testimonials />
      <FAQs />
      <CTAFooter />
      <LandingFooter />
    </main>
  );
}
