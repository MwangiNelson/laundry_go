"use client";

import React, { useState } from "react";
import { useGetVendorServices } from "@/api/vendor/services/use_get_vendor_services";
import { useGetAllServiceItems } from "@/api/vendor/services/use_get_all_service_items";
import { ServiceCard } from "./service_card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddServiceDialog } from "./add_service_dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ServicesCatalogSettings = () => {
  const { data: vendorServices = [], isLoading } = useGetVendorServices();
  const [newServiceId, setNewServiceId] = useState<number | null>(null);

  // Fetch service items for the newly selected service
  const { data: newServiceData } = useGetAllServiceItems(newServiceId);

  const handleServiceSelected = (mainServiceId: number, slug: string) => {
    setNewServiceId(mainServiceId);
  };

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

  // Combine vendor services with the newly selected service (if any)
  const allServices = [...vendorServices];
  if (
    newServiceData &&
    !vendorServices.find(
      (s) => s.main_service_id === newServiceData.main_service_id
    )
  ) {
    // Convert AllServiceData to VendorServiceData format
    allServices.push({
      main_service_id: newServiceData.main_service_id,
      main_service_name: newServiceData.main_service_name,
      main_service_slug: newServiceData.main_service_slug,
      service_items: [],
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Add the services you offer and set prices per item or package. You can
          customize quantities and pricing units for each service.
        </p>
        <AddServiceDialog
          onServiceSelected={handleServiceSelected}
          trigger={
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          }
        />
      </div>

      <div className="flex flex-col gap-4">
        {allServices.map((service) => (
          <ServiceCard key={service.main_service_id} service={service} />
        ))}
      </div>

      {allServices.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">No services configured yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Get started by adding your first service
              </p>
            </div>
            <AddServiceDialog onServiceSelected={handleServiceSelected} />
          </div>
        </div>
      )}
    </div>
  );
};
