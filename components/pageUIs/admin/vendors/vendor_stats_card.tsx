"use client";
import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatCardTitle,
  StatItem,
  type SelectOption,
} from "@/components/pageUIs/shared/start_cards";
import { useFetchVendorStats } from "@/api/admin/vendors/use_fetch_vendors";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const timeRangeOptions: SelectOption[] = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
  { value: "all_time", label: "All Time" },
];

export const VendorStatsCard = () => {
  const { data: stats, isLoading } = useFetchVendorStats();
  const [selectedTimeRange, setSelectedTimeRange] =
    React.useState("this_month");

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
          <span>Vendors</span>
          <StatCardSelect
            options={timeRangeOptions}
            placeholder="This Month"
            defaultValue={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          />
        </StatCardTitle>
        <Button size="sm" className="gap-2 rounded-xl">
          <Plus className="size-4" />
          <span className="text-xs font-medium">New Vendor</span>
        </Button>
      </StatCardHeader>

      <StatCardContent className="xl:grid-cols-4">
        <StatItem
          label="Under Review"
          value={stats?.under_review || 0}
          variant="purple"
        />
        <StatItem
          label="Onboarded Vendors"
          value={stats?.onboarded || 0}
          variant="blue"
        />
        <StatItem
          label="Active Vendors"
          value={stats?.active || 0}
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
