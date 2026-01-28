"use client";
import React, { useState } from "react";
import { LaundryOrdersTable } from "@/components/tables/vendors/orders/laundry_orders/laundry_orders.table";
import { ILaundryOrderTab } from "@/components/tables/vendors/orders/laundry_orders/laundry_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LaundryModalProvider } from "@/components/modals/vendors/orders/laundry/use_laundry_modal";
import { NewLaundryOrderModal } from "@/components/modals/vendors/orders/laundry/laundry_order_main.modal";

export const LaundryOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<ILaundryOrderTab>("all");

  return (
    <LaundryModalProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laundry Orders</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your laundry orders
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ILaundryOrderTab)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="in_pickup">In Pickup</TabsTrigger>
            <TabsTrigger value="in_processing">In Processing</TabsTrigger>
            <TabsTrigger value="ready_for_delivery">
              Ready for Delivery
            </TabsTrigger>
            <TabsTrigger value="under_delivery">Under Delivery</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <LaundryOrdersTable activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
      <NewLaundryOrderModal />
    </LaundryModalProvider>
  );
};
