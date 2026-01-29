"use client";
import React from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { vendorOrdersColumns, IVendorOrder } from "./vendor_order.column";
import { useFetchVendorOrders } from "@/api/admin/vendors/use_vendor_order";

interface VendorOrdersTableProps {
  vendorId?: string;
}

export const VendorOrdersTable = ({ vendorId }: VendorOrdersTableProps) => {
  const { data: ordersData, isLoading } = useFetchVendorOrders({
    vendor_id: vendorId || "",
    page: 1,
    page_size: 100,
  });

  // Transform API data to match table column interface
  const transformedOrders: IVendorOrder[] =
    ordersData?.data.map((order) => {
      // Map order status to simplified status for display
      let displayStatus: IVendorOrder["status"] = "pending";
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

      // Format order items for display
      const orderItemsText = order.order_items
        .map((item) => {
          const optionText = item.service_option
            ? ` - ${item.service_option.name}`
            : "";
          return `${item.service_item.name}${optionText} (${item.quantity})`;
        })
        .join(", ");

      const truncatedOrderItems =
        orderItemsText.length > 30
          ? orderItemsText.substring(0, 30) + "..."
          : orderItemsText;

      return {
        id: order.id,
        customer_name: order.customer.full_name || order.customer.email,
        service: order.main_service.service,
        order_items: truncatedOrderItems,
        payment_status: order.payment_status === "paid" ? "Paid" : "Unpaid",
        date_placed: order.created_at,
        status: displayStatus,
      };
    }) || [];

  return (
    <div className="space-y-4 flex flex-col w-full">
      <Table_Wrapper
        columns={vendorOrdersColumns}
        data={transformedOrders}
        loading={isLoading}
        tableOptions={{
          manualPagination: false,
        }}
      />
    </div>
  );
};
