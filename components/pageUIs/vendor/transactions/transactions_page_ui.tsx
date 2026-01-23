import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import { TransactionsEarningsLineChart } from "./transactions_earnings_line_chart";
import { TransactionsPie } from "./transactions_pie";
import { TransactionsTable } from "@/components/tables/vendors/transactions/transactions.table";

export const TransactionsPageUI = () => {
  return (
    <div className="p-6 space-y-4">
      {/* Stats Cards Section */}
      <StatCard>
        <StatCardHeader>
          <StatCardSelect
            options={[
              { value: "month", label: "This Month" },
              { value: "year", label: "This Year" },
              { value: "all", label: "All Time" },
            ]}
            defaultValue="month"
          />
        </StatCardHeader>
        <StatCardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-7">
          <StatItem
            label="Total Earnings (kes)"
            value="125,600"
            variant="blue"
            percentageChange="+11.01%"
          />
          <StatItem
            label="Total Refunds (kes)"
            value="24,000"
            variant="purple"
            percentageChange="-0.03%"
          />
          <StatItem
            label="Income from Service Charges (kes)"
            value="18,500"
            variant="blue"
          />
          <StatItem
            label="Income from delivery costs (kes)"
            value="41,300"
            variant="purple"
            percentageChange="+6.08%"
          />
        </StatCardContent>
      </StatCard>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <TransactionsEarningsLineChart />
        </div>
        <TransactionsPie />
      </div>
      <TransactionsTable />
    </div>
  );
};

export default TransactionsPageUI;
