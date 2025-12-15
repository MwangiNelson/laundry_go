"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { RiderTab } from "@/components/tables/vendors/riders/riders.data";
import { CreateRiderModal } from "@/components/modals/riders/create_rider.modal";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { RidersTable } from "@/components/tables/vendors/riders/riders.table";

export const RidersPageUI = () => {
  const { vendor } = useVendor();
  const [activeTab, setActiveTab] = useState<RiderTab>("all");

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-title font-manrope">
          Rider List
        </h1>
        <CreateRiderModal
          vendorId={vendor?.id}
          trigger={
            <Button>
              <PlusIcon />
              <span>Add Rider</span>
            </Button>
          }
        />
      </div>
      <RidersTable />
    </div>
  );
};
