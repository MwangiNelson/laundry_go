"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { officeCleaningOrdersColumns } from "./office_cleaning_orders.column";
import {
  getOfficeCleaningOrdersData,
  OfficeCleaningOrderTab,
} from "./office_cleaning_orders.data";
import { useOfficeCleaningModal } from "@/components/modals/vendors/orders/office_cleaning/use_office_cleaning_modal";

interface OfficeCleaningOrdersTableProps {
  activeTab: OfficeCleaningOrderTab;
}

export const OfficeCleaningOrdersTable = ({
  activeTab,
}: OfficeCleaningOrdersTableProps) => {
  const { openModal } = useOfficeCleaningModal();
  return (
    <Table_Wrapper
      columns={officeCleaningOrdersColumns}
      data={getOfficeCleaningOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        if (activeTab === "new" || activeTab === "ongoing") {
          openModal({ orderId: row.id, orderStatus: activeTab });
        }
      }}
    />
  );
};
