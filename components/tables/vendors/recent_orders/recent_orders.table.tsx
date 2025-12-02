"use client";
import React from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { recentOrdersColumns } from "./recent_orders.column";
import { getRecentOrdersData } from "./recent_orders.data";

export const RecentOrdersTable = () => {
  return (
    <div className="space-y-4 bg-card rounded-2xl p-6">
      <h1 className="text-lg font-bold text-title font-manrope">
        Recent Orders
      </h1>
      <Table_Wrapper
        columns={recentOrdersColumns}
        data={getRecentOrdersData()}
        onRowClick={(row) => {
          console.log("Row clicked:", row);
          // TODO: Add navigation or modal to view order details
        }}
      />
    </div>
  );
};
