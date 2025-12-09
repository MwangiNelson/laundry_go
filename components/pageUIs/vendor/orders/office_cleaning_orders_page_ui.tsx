"use client";
import React, { useState } from "react";
import { OfficeCleaningOrdersTable } from "@/components/tables/vendors/orders/office_cleaning_orders/office_cleaning_orders.table";
import { OfficeCleaningOrderTab } from "@/components/tables/vendors/orders/office_cleaning_orders/office_cleaning_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OfficeCleaningOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<OfficeCleaningOrderTab>("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Office Cleaning Orders
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your office cleaning orders
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as OfficeCleaningOrderTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="rated">Rated</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <OfficeCleaningOrdersTable activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
