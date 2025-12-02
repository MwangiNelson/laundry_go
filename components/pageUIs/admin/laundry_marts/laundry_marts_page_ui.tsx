import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import { LaundryMartsTable } from "@/components/tables/laundry_marts/laundry_marts.table";

const LaundryMartsPageUI = () => {
  return (
    <div className="p-6 space-y-4">
      <StatCard>
        <StatCardHeader>
          <StatCardSelect
            options={[
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ]}
            defaultValue="today"
          />
        </StatCardHeader>
        <StatCardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-7">
          <StatItem
            label="Total laundry marts"
            value="49"
            variant="blue"
            percentageChange="+11.01%"
          />
          <StatItem
            label="Active laundry marts"
            value="36"
            variant="purple"
            percentageChange="-0.03%"
          />
          <StatItem
            label="Pending Approvals"
            value="56"
            variant="blue"
            percentageChange="+6.08%"
          />
          <StatItem
            label="Suspended laundry marts"
            value="4"
            variant="purple"
            percentageChange="+6.08%"
          />
        </StatCardContent>
      </StatCard>
      <LaundryMartsTable />
    </div>
  );
};

export default LaundryMartsPageUI;
