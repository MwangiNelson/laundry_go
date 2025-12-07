"use client";
import React from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { ridersColumns } from "./riders.column";
import { getRidersData, RiderTab } from "./riders.data";

interface RidersTableProps {
  activeTab: RiderTab;
}

export const RidersTable = ({ activeTab }: RidersTableProps) => {
  return (
    <Table_Wrapper
      columns={ridersColumns}
      data={getRidersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        console.log("Row clicked:", row);
        // TODO: Add navigation or modal to view rider details
      }}
    />
  );
};
