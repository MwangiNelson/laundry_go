"use client";
import React, { useState } from "react";
import { MovingOrdersTable } from "@/components/tables/vendors/orders/moving_orders/moving_orders.table";
import { MovingOrderTab } from "@/components/tables/vendors/orders/moving_orders/moving_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MovingOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<MovingOrderTab>("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moving Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your moving orders
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as MovingOrderTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="rated">Rated</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <MovingOrdersTable activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
