"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetVendor } from "@/api/vendor/use_vendor";
import { useAuth } from "../auth_provider";

type Props = {
  children: React.ReactNode;
};

const useVendorProviders = () => {
  const { user: authUser } = useAuth();
  // In this context, assuming admin_id is the user's id
  const { data: vendor, isLoading: loading_vendor } = useGetVendor({
    admin_id: authUser?.id,
  });
  return {
    vendor: vendor!,
    user: authUser, // This is the profile data from auth
    loading_vendor,
  };
};

const VendorProviderContext = React.createContext<
  ReturnType<typeof useVendorProviders> | undefined
>(undefined);

export const VendorProvider = (props: Props) => {
  const vendorProviders = useVendorProviders();
  const { loggedIn, loading, setVendorId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn && !loading) {
      router.push("/auth/vendor/signin");
      return;
    }
    if (
      loggedIn &&
      !vendorProviders.loading_vendor &&
      !vendorProviders.vendor
    ) {
      router.push("/vendor/onboarding");
      return;
    }
    if (vendorProviders.vendor) {
      setVendorId(vendorProviders.vendor.id);
    }
  }, [
    loggedIn,
    loading,
    vendorProviders.vendor,
    vendorProviders.loading_vendor,
    router,
  ]);
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (vendorProviders.loading_vendor) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <span>Loading vendor...</span>
      </div>
    );
  }
  if (!vendorProviders.vendor) {
    return null;
  }

  return (
    <VendorProviderContext.Provider value={vendorProviders}>
      {props.children}
    </VendorProviderContext.Provider>
  );
};

export const useVendor = () => {
  const context = React.useContext(VendorProviderContext);
  if (context === undefined) {
    throw new Error("useVendormust be used within a VendorProvider");
  }
  return context;
};
