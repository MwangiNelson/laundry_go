import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import { VendorOrderLineChart } from "./vendor_order_line_chart";
import { RecentOrdersTable } from "@/components/tables/vendors/recent_orders/recent_orders.table";

export const VendorDashboardPageUI = () => {
  return (
    <div className="p-6 space-y-4">
      <StatCard>
        <StatCardHeader>
          {/* <StatCardTitle>Dashboard Overview</StatCardTitle> */}
          <StatCardSelect
            options={[
              { value: "month", label: "This Month" },
              { value: "year", label: "This Year" },
              { value: "all", label: "All Time" },
            ]}
            defaultValue="month"
          />
        </StatCardHeader>
        <StatCardContent>
          <StatItem
            label="New Orders"
            value="9"
            variant="blue"
            percentageChange="+11.01%"
          />
          <StatItem
            label="In Progress Orders"
            value="36"
            variant="purple"
            percentageChange="-0.03%"
          />
          <StatItem
            label="Ready for Delivery"
            value="10"
            variant="blue"
            percentageChange="+15.03%"
          />
          <StatItem
            label="Total Orders"
            value="56"
            variant="blue"
            percentageChange="+6.08%"
          />
          <StatItem
            label="Total Revenue (kes)"
            value="45,679"
            variant="purple"
            percentageChange="+6.08%"
          />
        </StatCardContent>
      </StatCard>
      <VendorOrderLineChart />
      <RecentOrdersTable />
    </div>
  );
};
