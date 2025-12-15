import React from "react";
import { VendorStatsCard } from "./vendor_stats_card";
import { VendorsTable } from "@/components/tables/admin/vendors/vendors.table";

const VendorsPageUI = () => {
  return (
    <div className="space-y-6 p-6">
      <VendorStatsCard />
      <VendorsTable />
    </div>
  );
};

export default VendorsPageUI;
