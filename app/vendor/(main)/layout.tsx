"use client";
import { VendorProvider, useVendor } from "@/components/context/vendors/vendor_provider";
import { VendorNavbar } from "@/components/layouts/vendor/vendor_nav";
import { VendorSidebar } from "@/components/layouts/vendor/vendor_sidebar";
import { VendorUIProvider } from "@/components/layouts/vendor/vendor_ui_provider";
import { Info } from "lucide-react";
import React from "react";

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
      </VendorUIProvider>
    </VendorProvider>
  );
};

export default Layout;
