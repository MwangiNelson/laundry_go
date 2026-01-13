"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
type GeoContextType = {
  isMapLoaded: boolean;
  loadError: Error | undefined;
};

const GeoContext = createContext<GeoContextType | undefined>(undefined);

export function GeoProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: isMapLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: ["places", "geometry", "routes"],
  });
  const pathname = usePathname();

  const value = {
    isMapLoaded,
    loadError,
  };
  useEffect(() => {
    //scroll to top on route change
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <GeoContext.Provider value={value}>
      <TooltipProvider>{children}</TooltipProvider>
    </GeoContext.Provider>
  );
}

export function useGeo() {
  const context = useContext(GeoContext);
  if (context === undefined) {
    throw new Error("useGeo must be used within a GeoProvider");
  }
  return context;
}
