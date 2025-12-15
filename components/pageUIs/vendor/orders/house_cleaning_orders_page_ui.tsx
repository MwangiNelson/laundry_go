"use client";
import React, { useState } from "react";
import { HouseCleaningOrdersTable } from "@/components/tables/vendors/orders/house_cleaning_orders/house_cleaning_orders.table";
import { IHouseCleaningOrderTab } from "@/components/tables/vendors/orders/house_cleaning_orders/house_cleaning_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const HouseCleaningOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<IHouseCleaningOrderTab>("all");
  return (
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
        onValueChange={(value) => setActiveTab(value as IHouseCleaningOrderTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="rated">Rated</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <HouseCleaningOrdersTable activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
