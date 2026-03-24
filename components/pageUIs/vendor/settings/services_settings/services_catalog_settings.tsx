"use client";

import React from "react";
import { useGetVendorServices } from "@/api/vendor/services/use_get_vendor_services";
import { ServiceCard } from "./service_card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddServiceDialog } from "./add_service_dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Add the services you offer and set prices per item or package. You can
          customize quantities and pricing units for each service.
        </p>
        <AddServiceDialog
          trigger={
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          }
        />
      </div>

      <div className="flex flex-col gap-4">
        {vendorServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {vendorServices.length === 0 && (
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
            <AddServiceDialog />
          </div>
        </div>
      )}
    </div>
  );
};
