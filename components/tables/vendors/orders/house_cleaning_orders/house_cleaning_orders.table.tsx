"use client";
import React from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { houseCleaningOrdersColumns } from "./house_cleaning_orders.column";
import {
  getHouseCleaningOrdersData,
  HouseCleaningOrderTab,
} from "./house_cleaning_orders.data";
import { useHouseCleaningModal } from "@/components/modals/vendors/orders/house_cleaning/use_house_cleaning_modal";

interface HouseCleaningOrdersTableProps {
  activeTab: HouseCleaningOrderTab;
}

export const HouseCleaningOrdersTable = ({
  activeTab,
}: HouseCleaningOrdersTableProps) => {
  const { openModal } = useHouseCleaningModal();
  return (
    <Table_Wrapper
      columns={houseCleaningOrdersColumns}
      data={getHouseCleaningOrdersData(activeTab)}
      enableRowSelection
      onRowClick={(row) => {
        if (activeTab === "new" || activeTab === "ongoing") {
          openModal({ orderId: row.id, orderStatus: activeTab });
        }
      }}
    />
  );
};
