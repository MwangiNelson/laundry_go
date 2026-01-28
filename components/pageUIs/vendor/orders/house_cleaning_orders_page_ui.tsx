"use client";
import React, { useState } from "react";
import { HouseCleaningOrdersTable } from "@/components/tables/vendors/orders/house_cleaning_orders/house_cleaning_orders.table";
import { IHouseCleaningOrderTab } from "@/components/tables/vendors/orders/house_cleaning_orders/house_cleaning_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HouseCleaningModalProvider } from "@/components/modals/vendors/orders/house_cleaning/use_house_cleaning_modal";
import { HouseCleaningOrderMainModal } from "@/components/modals/vendors/orders/house_cleaning/house_cleaning_order_main.modal";

export const HouseCleaningOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<IHouseCleaningOrderTab>("all");
  return (
    <HouseCleaningModalProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            House Cleaning Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your house cleaning orders
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as IHouseCleaningOrderTab)
          }
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="in_processing">In Processing</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <HouseCleaningOrdersTable activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
      <HouseCleaningOrderMainModal />
    </HouseCleaningModalProvider>
  );
};
