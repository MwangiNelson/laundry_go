"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { fumigationOrdersColumns } from "./fumigation_orders.column";
import {
  getFumigationOrdersData,
  FumigationOrderTab,
} from "./fumigation_orders.data";

interface FumigationOrdersTableProps {
  activeTab: FumigationOrderTab;
}

export const FumigationOrdersTable = ({
  activeTab,
}: FumigationOrdersTableProps) => {
  return (
    <Table_Wrapper
      columns={fumigationOrdersColumns}
      data={getFumigationOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        console.log("Row clicked:", row);
        // TODO: Add navigation or modal to view order details
      }}
    />
  );
};
