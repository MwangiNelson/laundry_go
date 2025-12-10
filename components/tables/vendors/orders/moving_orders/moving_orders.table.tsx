"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { movingOrdersColumns } from "./moving_orders.column";
import { getMovingOrdersData, MovingOrderTab } from "./moving_orders.data";
import { useMovingModal } from "../../../../modals/vendors/orders/moving/use_moving_modal";

interface MovingOrdersTableProps {
  activeTab: MovingOrderTab;
}

export const MovingOrdersTable = ({ activeTab }: MovingOrdersTableProps) => {
  const { openModal } = useMovingModal();

  return (
    <Table_Wrapper
      columns={movingOrdersColumns}
      data={getMovingOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        if (
          !(activeTab == "all") &&
          (activeTab === "new" || activeTab === "ongoing")
        ) {
          openModal({ orderId: row.id, orderStatus: activeTab });
        }
      }}
    />
  );
};
