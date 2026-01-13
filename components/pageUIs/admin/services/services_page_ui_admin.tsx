import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import ServicesPerformanceLineChart from "./services_perfomance_line_chart";
import TotalRevenue from "./total_revenue";
import { AdminServicesTable } from "@/components/tables/admin/services/admin_services_table.table";

export const ServicesPageUIAdmin = () => {
  return (
    <div className="p-6 space-y-4">
      <StatCard>
        <StatCardHeader>
          <StatCardSelect
            options={[
              { value: "month", label: "This Month" },
              { value: "week", label: "This Week" },
              { value: "year", label: "This Year" },
            ]}
            defaultValue="month"
          />
        </StatCardHeader>
        <StatCardContent>
          <StatItem
            label="Total Services Revenue (KES)"
            value="1.4M"
            variant="blue"
          />
          <StatItem label="Total Customers" value="428" variant="purple" />
          <StatItem label="Total Orders" value="490" variant="blue" />
          <StatItem label="Active Vendors" value="36" variant="purple" />
        </StatCardContent>
      </StatCard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <ServicesPerformanceLineChart />
        </div>
        <TotalRevenue />
      </div>
      <AdminServicesTable />
    </div>
  );
};
