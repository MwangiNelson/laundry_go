"use client";

import React from "react";
import { useGetVendorServices } from "@/api/vendor/services/use_get_vendor_services";
import { ServiceCard } from "./service_card";
import { Skeleton } from "@/components/ui/skeleton";

export const ServicesCatalogSettings = () => {
  const { data: vendorServices = [], isLoading } = useGetVendorServices();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Add the services you offer and set prices per item or package. You can
          customize quantities and pricing units for each service.
        </p>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Add the services you offer and set prices per item or package. You can
        customize quantities and pricing units for each service.
      </p>

      <div className="flex flex-col gap-4">
        {vendorServices.map((service) => (
          <ServiceCard key={service.main_service_id} service={service} />
        ))}
      </div>

      {vendorServices.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No services configured yet.</p>
          <p className="text-sm mt-2">
            Start by enabling services during onboarding or contact support.
          </p>
        </div>
      )}
    </div>
  );
};
