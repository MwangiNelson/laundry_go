"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { ServicesTable } from "@/components/tables/vendors/services/services.table";

export const ServicesPageUI = () => {
  const { vendor } = useVendor();

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-title font-manrope">
          Services & Pricing
        </h1>
        <Button>
          <PlusIcon />
          <span>Add Service</span>
        </Button>
      </div>
      <ServicesTable />
    </div>
  );
};
