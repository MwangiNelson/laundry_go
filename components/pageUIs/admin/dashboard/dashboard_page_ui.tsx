"use client";
import React, { useState } from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import OrderLineChart from "./order_line_chart";
import TopMartsPie from "./top_marts_pie";
import RevenuePayoutChart from "./revenue_x_payout";
import ActivityFeed from "./activity_feed";
import {
  useAdminDashboardStats,
  calcPercentageChange,
  type DashboardPeriod,
} from "@/api/admin/dashboard/use_admin_dashboard";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPageUI = () => {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const { data: stats, isLoading } = useAdminDashboardStats({ period });

  return (
    <div className="p-6 space-y-4">
      <StatCard>
        <StatCardHeader>
          <StatCardSelect
            options={[
              { value: "month", label: "This Month" },
              { value: "year", label: "This Year" },
              { value: "all", label: "All Time" },
            ]}
            defaultValue={period}
            onValueChange={(v) => setPeriod(v as DashboardPeriod)}
          />
        </StatCardHeader>
        {isLoading ? (
          <StatCardContent>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[112px] rounded-2xl" />
            ))}
          </StatCardContent>
        ) : (
          <StatCardContent>
            <StatItem
              label="Total Laundry marts"
              value={stats?.total_laundry_marts?.toLocaleString() ?? "0"}
              variant="blue"
              percentageChange={calcPercentageChange(
                stats?.total_laundry_marts,
                stats?.prev_total_laundry_marts
              )}
            />
            <StatItem
              label="Active Laundry marts"
              value={stats?.active_laundry_marts?.toLocaleString() ?? "0"}
              variant="purple"
              percentageChange={calcPercentageChange(
                stats?.active_laundry_marts,
                stats?.prev_active_laundry_marts
              )}
            />
            <StatItem
              label="Total Orders"
              value={stats?.total_orders?.toLocaleString() ?? "0"}
              variant="blue"
              percentageChange={calcPercentageChange(
                stats?.total_orders,
                stats?.prev_total_orders
              )}
            />
            <StatItem
              label="Total Revenue (kes)"
              value={stats?.total_revenue?.toLocaleString() ?? "0"}
              variant="purple"
              percentageChange={calcPercentageChange(
                stats?.total_revenue,
                stats?.prev_total_revenue
              )}
            />
            <StatItem
              label="Pending payouts"
              value={stats?.pending_payouts?.toLocaleString() ?? "0"}
              variant="blue"
              percentageChange={calcPercentageChange(
                stats?.pending_payouts,
                stats?.prev_pending_payouts
              )}
            />
          </StatCardContent>
        )}
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
