"use client";
import React, { useState } from "react";
import { FumigationOrdersTable } from "@/components/tables/vendors/orders/fumigation_orders/fumigation_orders.table";
import { IFumigationOrderTab } from "@/components/tables/vendors/orders/fumigation_orders/fumigation_orders.data";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FumigationModalProvider } from "@/components/modals/vendors/orders/fumigation/use_fumigation_modal";
import { FumigationOrderMainModal } from "@/components/modals/vendors/orders/fumigation/fumigation_order_main.modal";

export const FumigationOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<IFumigationOrderTab>("all");

  return (
    <FumigationModalProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Fumigation Orders
          </h1>
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
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="in_processing">In Processing</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <FumigationOrdersTable activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
      <FumigationOrderMainModal />
    </FumigationModalProvider>
  );
};
