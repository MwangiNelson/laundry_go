"use client";
import React from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { recentOrdersColumns } from "./recent_orders.column";
import { useFetchOrders } from "@/api/vendor/order/use_fetch_orders";
import { useAuth } from "@/components/context/auth_provider";
import { useLaundryModal } from "@/components/modals/vendors/orders/laundry/use_laundry_modal";

export const RecentOrdersTable = () => {
  const { vendor_id } = useAuth();
  const { openModal } = useLaundryModal();

  // Fetch recent orders (last 10 orders across all services)
  const { data: ordersData, isLoading } = useFetchOrders({
    vendor_id: vendor_id,
    page: 1,
    page_size: 10,
    sort_by: "created_at",
    sort_order: "DESC",
  });

  const orders = ordersData?.data || [];

  return (
    <div className="space-y-4 bg-card rounded-2xl p-6">
      <h1 className="text-lg font-bold text-title font-manrope">
        Recent Orders
      </h1>
      <Table_Wrapper
        columns={recentOrdersColumns}
        data={orders}
        loading={isLoading}
        onRowClick={(row) => {
          openModal({
            order: row,
          });
        }}
      />
    </div>
  );
};
