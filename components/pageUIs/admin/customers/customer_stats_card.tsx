"use client";
import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardTitle,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import { useFetchCustomerStats } from "@/api/admin/customers/use_customers";

export const CustomerStatsCard = () => {
  const { data: stats, isLoading } = useFetchCustomerStats();

  if (isLoading) {
    return (
      <StatCard className="space-y-4">
        <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
        <div className="grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[112px] bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </StatCard>
    );
  }

  return (
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>
          <h1 className="font-semibold text-lg">Customers</h1>
        </StatCardTitle>
      </StatCardHeader>

      <StatCardContent className="xl:grid-cols-4">
        <StatItem
          label="Total Customers"
          value={stats?.total_customers || 0}
          variant="purple"
        />
        <StatItem
          label="Total Orders"
          value={stats?.total_orders || 0}
          variant="blue"
        />
        <StatItem
          label="Active Accounts"
          value={stats?.active_accounts || 0}
          variant="purple"
        />
        <StatItem
          label="Suspended"
          value={stats?.suspended || 0}
          variant="blue"
        />
      </StatCardContent>
    </StatCard>
  );
};
