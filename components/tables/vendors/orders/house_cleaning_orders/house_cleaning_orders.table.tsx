"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { houseCleaningOrdersColumns } from "./house_cleaning_orders.column";
import {
  getHouseCleaningOrdersData,
  HouseCleaningOrderTab,
} from "./house_cleaning_orders.data";

interface HouseCleaningOrdersTableProps {
  activeTab: HouseCleaningOrderTab;
}

export const HouseCleaningOrdersTable = ({
  activeTab,
}: HouseCleaningOrdersTableProps) => {
  return (
    <Table_Wrapper
      columns={houseCleaningOrdersColumns}
      data={getHouseCleaningOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        console.log("Row clicked:", row);
        // TODO: Add navigation or modal to view order details
      }}
    />
  );
};
