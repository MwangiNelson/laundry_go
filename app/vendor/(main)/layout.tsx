"use client";
import { VendorProvider, useVendor } from "@/components/context/vendors/vendor_provider";
import { VendorNavbar } from "@/components/layouts/vendor/vendor_nav";
import { VendorSidebar } from "@/components/layouts/vendor/vendor_sidebar";
import { VendorUIProvider } from "@/components/layouts/vendor/vendor_ui_provider";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";

type Props = {
  children: React.ReactNode;
};

const PendingBanner = () => {
  const { vendor } = useVendor();
  if (vendor?.status !== "pending") return null;
  return (
    <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
      <Info className="h-4 w-4 shrink-0" />
      <p>
        Your application is under review by our operations team. This process
        typically takes 2 business days or less. You will be notified via your
        registered email once approved.
      </p>
    </div>
  );
};

const COMPLETED_STEPS = [
  "Business Information",
  "Business Type",
  "Services & Pricing",
  "Branch Information",
];

const OnboardingCompleteModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

  const fireConfetti = useCallback(() => {
    confettiRef.current?.fire({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    });
    confettiRef.current?.fire({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
    });
  }, []);

  useEffect(() => {
    if (searchParams.get("onboarding") === "complete") {
      setOpen(true);
      router.replace("/vendor", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => fireConfetti(), 300);
      return () => clearTimeout(t);
    }
  }, [open, fireConfetti]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
        <DialogPrimitive.Content className=" data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%]  duration-200 sm:max-w-4xl overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center pt-8 pb-10">
            <Image
              src="/logos/main.svg"
              alt="LaundryGo!"
              width={180}
              height={48}
              priority
            />
          </div>

          <div className="px-8 pb-8 bg-white text-center space-y-6 rounded-2xl border-none shadow-xl">
            <DialogHeader className="space-y-1 text-center sm:text-center">
              <DialogTitle className="text-lg font-semibold text-foreground mt-4">
                Account Application Successful!
              </DialogTitle>
              <DialogDescription className="sr-only">
                Your onboarding application has been submitted successfully.
              </DialogDescription>
            </DialogHeader>

            {/* Completed steps indicator */}
            <div className="flex items-center justify-center gap-0 px-2">
              {COMPLETED_STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white shrink-0">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                    <span className="text-[11px] leading-tight text-muted-foreground text-center w-32">
                      {label}
                    </span>
                  </div>
                  {i < COMPLETED_STEPS.length - 1 && (
                    <div className="h-0.5 w-12 sm:w-12 bg-sky-500 -mt-5 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Review message */}
            <div className="space-y-2 pt-2">
              <h3 className="text-base font-semibold text-foreground">
                Your Application is Under Review
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The submitted information is under review by our operations team
                to approve your application. This process typically takes 2
                business days or less and once completed you will be notified via
                your registered email. If this takes too long, please{" "}
                <Link
                  href="/landing#contact"
                  className="text-sky-500 hover:text-sky-600 transition-colors"
                >
                  contact support
                </Link>
                .
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={() => setOpen(false)}
              className="w-full h-11 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium"
            >
              Proceed to Dashboard
            </Button>
          </div>

          <Confetti
            ref={confettiRef}
            manualstart
            className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
          />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

const Layout = (props: Props) => {
  return (
    <VendorProvider>
      <VendorUIProvider>
        <div className="bg-background text-foreground flex min-h-svh w-full font-poppins">
          <aside className="text-muted-foreground flex h-svh sticky top-0">
            <VendorSidebar />
          </aside>
          <main className="flex-1 min-w-0">
            <div className="sticky top-0 z-10">
              <VendorNavbar />
            </div>
            <PendingBanner />
            <div className="">{props.children}</div>
          </main>
        </div>
        <Suspense>
          <OnboardingCompleteModal />
        </Suspense>
      </VendorUIProvider>
    </VendorProvider>
  );
};

export default Layout;
