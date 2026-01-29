import React from "react";
import { CustomerStatsCard } from "./customer_stats_card";
import { CustomersTable } from "@/components/tables/admin/customers/customers.table";

export const Customer_Page_UI = () => {
  return (
    <div className="space-y-6 p-4">
      <CustomerStatsCard />
      <CustomersTable />
    </div>
  );
};
