"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetVendor } from "@/api/vendor/use_vendor";
import { useAuth } from "../auth_provider";

type Props = {
  children: React.ReactNode;
};

const useVendorProviders = () => {
  const { user } = useAuth();
  // In this context, assuming admin_id is the user's id
  const { data: vendor, isLoading: loading_vendor } = useGetVendor({
    admin_id: user?.id,
  });
  return {
    vendor,
    user,
    loading_vendor,
  };
};

const VendorProviderContext = React.createContext<
  ReturnType<typeof useVendorProviders> | undefined
>(undefined);

export const VendorProvider = (props: Props) => {
  const vendorProviders = useVendorProviders();
  const { loggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Not logged in and not loading → redirect to signin
    if (!loggedIn && !loading) {
      router.push("/auth/vendor/signin");
      return;
    }

    // Logged in but no vendor found → redirect to onboarding
    if (
      loggedIn &&
      !vendorProviders.loading_vendor &&
      !vendorProviders.vendor
    ) {
      router.push("/vendor/onboarding");
      return;
    }
  }, [
    loggedIn,
    loading,
    vendorProviders.vendor,
    vendorProviders.loading_vendor,
    router,
  ]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  // Not logged in - show nothing while redirecting
  if (!loggedIn) {
    return null;
  }

  // Show loading while fetching vendor
  if (vendorProviders.loading_vendor) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span>Loading vendor...</span>
      </div>
    );
  }

  // No vendor found - show nothing while redirecting to onboarding
  if (!vendorProviders.vendor) {
    return null;
  }

  return (
    <VendorProviderContext.Provider value={vendorProviders}>
      {props.children}
    </VendorProviderContext.Provider>
  );
};

export const useVendorProvider = () => {
  const context = React.useContext(VendorProviderContext);
  if (context === undefined) {
    throw new Error("useVendorProvider must be used within a VendorProvider");
  }
  return context;
};
