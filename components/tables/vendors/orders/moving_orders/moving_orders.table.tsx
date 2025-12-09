"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { movingOrdersColumns } from "./moving_orders.column";
import { getMovingOrdersData, MovingOrderTab } from "./moving_orders.data";

interface MovingOrdersTableProps {
  activeTab: MovingOrderTab;
}

export const MovingOrdersTable = ({ activeTab }: MovingOrdersTableProps) => {
  return (
    <Table_Wrapper
      columns={movingOrdersColumns}
      data={getMovingOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        console.log("Row clicked:", row);
        // TODO: Add navigation or modal to view order details
      }}
    />
  );
};
