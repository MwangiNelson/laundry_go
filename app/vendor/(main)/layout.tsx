"use client";
import { VendorProvider } from "@/components/context/vendors/vendor_provider";
import { VendorNavbar } from "@/components/layouts/vendor/vendor_nav";
import { VendorSidebar } from "@/components/layouts/vendor/vendor_sidebar";
import { VendorUIProvider } from "@/components/layouts/vendor/vendor_ui_provider";
import React from "react";

type Props = {
  children: React.ReactNode;
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
            <div className="">{props.children}</div>
          </main>
        </div>
      </VendorUIProvider>
    </VendorProvider>
  );
};

export default Layout;
