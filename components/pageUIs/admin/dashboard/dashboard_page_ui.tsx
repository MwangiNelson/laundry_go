import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatCardTitle,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import OrderLineChart from "./order_line_chart";
import TopMartsPie from "./top_marts_pie";
import RevenuePayoutChart from "./revenue_x_payout";
import ActivityFeed from "./activity_feed";

const DashboardPageUI = () => {
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
            label="Total Laundry marts"
            value="49"
            variant="blue"
            percentageChange="+11.01%"
          />
          <StatItem
            label="Active Laundry marts"
            value="36"
            variant="purple"
            percentageChange="-0.03%"
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
          <StatItem
            label="Pending payouts"
            value="10"
            variant="blue"
            percentageChange="+15.03%"
          />
        </StatCardContent>
      </StatCard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <div className="col-span-2">
          <OrderLineChart />
        </div>
        <TopMartsPie />
      </div>
      <RevenuePayoutChart />
      <ActivityFeed />
    </div>
  );
};

export default DashboardPageUI;
