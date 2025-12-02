"use client";
import { useAuth } from "@/components/context/auth_provider";
import { DashboardUIProvider } from "@/components/context/dashboard_ui_provider";
import { DashboardNavbar } from "@/components/layouts/admin/dashboard_nav";
import { DashboardSidebar } from "@/components/layouts/admin/dashboard_sidebar";
import { VendorNavbar } from "@/components/layouts/vendor/vendor_nav";
import { VendorSidebar } from "@/components/layouts/vendor/vendor_sidebar";
import { VendorUIProvider } from "@/components/layouts/vendor/vendor_ui_provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  // const { user, loggedIn, loading, auth_user } = useAuth();
  // const router = useRouter();
  // useEffect(() => {
  //   if (!loggedIn && !loading) {
  //     setTimeout(() => {
  //       router.push("/auth/signin");
  //     }, 1000);
  //   }
  // }, [loggedIn, loading, router]);
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen w-screen">
  //       <p className="text-foreground text-lg">Loading...</p>
  //     </div>
  //   );
  // }
  // if (!loggedIn) {
  //   return <></>;
  // }
  return (
    <VendorUIProvider>
      <div className="bg-background text-foreground flex min-h-svh w-full font-poppins">
        <aside className=" text-muted-foreground flex h-svh sticky top-0">
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
  );
};

export default Layout;
