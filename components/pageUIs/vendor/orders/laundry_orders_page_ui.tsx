"use client";
import React, { useState } from "react";
import { LaundryOrdersTable } from "@/components/tables/vendors/orders/laundry_orders/laundry_orders.table";
import { ILaundryOrderTab } from "@/components/tables/vendors/orders/laundry_orders/laundry_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LaundryOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<ILaundryOrderTab>("all");

  return (
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
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <LaundryOrdersTable activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
