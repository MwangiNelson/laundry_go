"use client";
import React, { useState } from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import { VendorOrderLineChart } from "./vendor_order_line_chart";
import { RecentOrdersTable } from "@/components/tables/vendors/recent_orders/recent_orders.table";
import {
  useVendorDashboardStats,
  calcPercentageChange,
  DashboardPeriod,
} from "@/api/vendor/dashboard/use_vendor_dashboard";

export const VendorDashboardPageUI = () => {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const { data: stats } = useVendorDashboardStats({ period });

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
            onValueChange={(value) => setPeriod(value as DashboardPeriod)}
          />
        </StatCardHeader>
        <StatCardContent className="xl:grid-cols-5">
          <StatItem
            label="New Orders"
            value={stats?.new_orders.toLocaleString() ?? "0"}
            variant="blue"
            percentageChange={calcPercentageChange(
              stats?.new_orders,
              stats?.prev_new_orders
            )}
          />
          <StatItem
            label="In Progress Orders"
            value={stats?.in_progress_orders.toLocaleString() ?? "0"}
            variant="purple"
            percentageChange={calcPercentageChange(
              stats?.in_progress_orders,
              stats?.prev_in_progress_orders
            )}
          />
          <StatItem
            label="Ready for Delivery"
            value={stats?.ready_for_delivery.toLocaleString() ?? "0"}
            variant="blue"
            percentageChange={calcPercentageChange(
              stats?.ready_for_delivery,
              stats?.prev_ready_for_delivery
            )}
          />
          <StatItem
            label="Total Orders"
            value={stats?.total_orders.toLocaleString() ?? "0"}
            variant="blue"
            percentageChange={calcPercentageChange(
              stats?.total_orders,
              stats?.prev_total_orders
            )}
          />
          <StatItem
            label="Total Revenue (KES)"
            value={stats?.total_revenue.toLocaleString() ?? "0"}
            variant="purple"
            percentageChange={calcPercentageChange(
              stats?.total_revenue,
              stats?.prev_total_revenue
            )}
          />
        </StatCardContent>
      </StatCard>
      <VendorOrderLineChart />
      <RecentOrdersTable />
    </div>
  );
};
