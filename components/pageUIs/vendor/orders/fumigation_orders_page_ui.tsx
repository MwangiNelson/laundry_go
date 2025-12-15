"use client";
import React, { useState } from "react";
import { FumigationOrdersTable } from "@/components/tables/vendors/orders/fumigation_orders/fumigation_orders.table";
import { IFumigationOrderTab } from "@/components/tables/vendors/orders/fumigation_orders/fumigation_orders.data";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FumigationOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<IFumigationOrderTab>("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fumigation Orders</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your fumigation orders
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as IFumigationOrderTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="rated">Rated</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <FumigationOrdersTable activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
