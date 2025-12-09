"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { officeCleaningOrdersColumns } from "./office_cleaning_orders.column";
import {
  getOfficeCleaningOrdersData,
  OfficeCleaningOrderTab,
} from "./office_cleaning_orders.data";

interface OfficeCleaningOrdersTableProps {
  activeTab: OfficeCleaningOrderTab;
}

export const OfficeCleaningOrdersTable = ({
  activeTab,
}: OfficeCleaningOrdersTableProps) => {
  return (
    <Table_Wrapper
      columns={officeCleaningOrdersColumns}
      data={getOfficeCleaningOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        console.log("Row clicked:", row);
        // TODO: Add navigation or modal to view order details
      }}
    />
  );
};
