"use client";
import React, { useState } from "react";
import { DryCleaningOrdersTable } from "@/components/tables/vendors/orders/dry_cleaning/dry_cleaning_orders.table";
import { IDryCleaningOrderTab } from "@/components/tables/vendors/orders/dry_cleaning/dry_cleaning_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DryCleaningModalProvider } from "@/components/modals/vendors/orders/dry_cleaning/use_dry_cleaning_modal";
import { NewDryCleaningOrderMainModal } from "@/components/modals/vendors/orders/dry_cleaning/dry_cleaning_order_main.modal";

export const DryCleaningOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<IDryCleaningOrderTab>("all");

  return (
    <DryCleaningModalProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dry Cleaning Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your dry cleaning orders
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as IDryCleaningOrderTab)}
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
            <DryCleaningOrdersTable activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
      <NewDryCleaningOrderMainModal />
    </DryCleaningModalProvider>
  );
};
