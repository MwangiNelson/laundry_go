"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { fumigationOrdersColumns } from "./fumigation_orders.column";
import {
  getFumigationOrdersData,
  FumigationOrderTab,
} from "./fumigation_orders.data";
import {
  useFumigationModal,
  generateMockFumigationOrder,
} from "@/components/modals/vendors/orders/fumigation/use_fumigation_modal";

interface FumigationOrdersTableProps {
  activeTab: FumigationOrderTab;
}

export const FumigationOrdersTable = ({
  activeTab,
}: FumigationOrdersTableProps) => {
  const { openModal } = useFumigationModal();

  return (
    <Table_Wrapper
      columns={fumigationOrdersColumns}
      data={getFumigationOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        if (activeTab === "new" || activeTab === "ongoing") {
          const mockOrder = generateMockFumigationOrder();
          openModal(mockOrder, activeTab);
        }
      }}
    />
  );
};
