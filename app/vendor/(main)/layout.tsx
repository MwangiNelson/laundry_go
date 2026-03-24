"use client";
import { VendorProvider, useVendor } from "@/components/context/vendors/vendor_provider";
import { VendorNavbar } from "@/components/layouts/vendor/vendor_nav";
import { VendorSidebar } from "@/components/layouts/vendor/vendor_sidebar";
import { VendorUIProvider } from "@/components/layouts/vendor/vendor_ui_provider";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ClockAlert, Info, XIcon } from "lucide-react";
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

const OnboardingCompleteModal = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

  const fireConfetti = useCallback(() => {
    // Fire from left side
    confettiRef.current?.fire({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    });
    // Fire from right side
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
      // Clean the URL without triggering a navigation
      router.replace("/vendor", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (open) {
      // Small delay so canvas is mounted
      const t = setTimeout(() => fireConfetti(), 300);
      return () => clearTimeout(t);
    }
  }, [open, fireConfetti]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
        <DialogPrimitive.Content className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-3xl border-none shadow-lg duration-200 sm:max-w-md overflow-hidden">
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="px-6 pt-8 pb-6 text-center space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <ClockAlert className="h-7 w-7 text-amber-600" />
            </div>

            <DialogHeader className="space-y-2 text-center sm:text-center">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Application Under Review
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                Your application has been submitted successfully! Our operations
                team is reviewing your information. This typically takes{" "}
                <span className="font-medium text-foreground">
                  2 business days or less
                </span>
                . You&apos;ll be notified via email once approved.
              </DialogDescription>
            </DialogHeader>

            <p className="text-xs text-muted-foreground">
              Taking too long?{" "}
              <Link
                href="/landing#contact"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Contact support
              </Link>
            </p>

            <Button
              onClick={() => setOpen(false)}
              className="w-full h-10 rounded-xl"
            >
              Proceed to dashboard
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
