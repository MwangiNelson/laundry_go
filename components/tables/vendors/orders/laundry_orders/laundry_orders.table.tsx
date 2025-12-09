"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { laundryOrdersColumns } from "./laundry_orders.column";
import { getLaundryOrdersData, LaundryOrderTab } from "./laundry_orders.data";
import { useLaundryModal } from "@/components/modals/vendors/orders/laundry/use_laundry_modal";

interface LaundryOrdersTableProps {
  activeTab: LaundryOrderTab;
}

export const LaundryOrdersTable = ({ activeTab }: LaundryOrdersTableProps) => {
  const { openModal } = useLaundryModal();

  return (
    <Table_Wrapper
      columns={laundryOrdersColumns}
      data={getLaundryOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        if (!(activeTab == "all")) {
          openModal({ orderId: row.id, orderStatus: activeTab });
        }
      }}
    />
  );
};
