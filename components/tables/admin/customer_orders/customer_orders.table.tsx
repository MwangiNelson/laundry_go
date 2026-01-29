"use client";
import React from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { customerOrdersColumns, ICustomerOrder } from "./customer_order.column";
import { useFetchCustomerOrders } from "@/api/admin/customers/use_customers";

interface CustomerOrdersTableProps {
  customerId?: string;
}

export const CustomerOrdersTable = ({
  customerId,
}: CustomerOrdersTableProps) => {
  const { data: ordersData, isLoading } = useFetchCustomerOrders({
    customer_id: customerId || "",
    page: 1,
    page_size: 100,
  });

  // Transform API data to match table column interface
  const transformedOrders: ICustomerOrder[] =
    ordersData?.data.map((order) => {
      // Map order status to simplified status for display
      let displayStatus: ICustomerOrder["status"] = "pending";
      if (order.status === "complete") {
        displayStatus = "completed";
      } else if (order.status === "cancelled") {
        displayStatus = "cancelled";
      } else if (
        [
          "under_review",
          "accepted",
          "in_pickup",
          "in_processing",
          "ready_for_delivery",
          "under_delivery",
        ].includes(order.status)
      ) {
        displayStatus = "pending";
      }

      return {
        id: order.id,
        service: order.service,
        order_items:
          order.order_items.length > 30
            ? order.order_items.substring(0, 30) + "..."
            : order.order_items,
        payment_status: order.payment_status === "paid" ? "Paid" : "Unpaid",
        date_placed: order.created_at,
        status: displayStatus,
      };
    }) || [];

  return (
    <div className="space-y-4 flex flex-col w-full">
      <Table_Wrapper
        columns={customerOrdersColumns}
        data={transformedOrders}
        loading={isLoading}
        tableOptions={{
          manualPagination: false,
        }}
      />
    </div>
  );
};
