"use client";
import React, { useState } from "react";
import { MovingOrdersTable } from "@/components/tables/vendors/orders/moving_orders/moving_orders.table";
import { IMovingOrderTab } from "@/components/tables/vendors/orders/moving_orders/moving_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovingModalProvider } from "@/components/modals/vendors/orders/moving/use_moving_modal";
import { MovingOrderMainModal } from "@/components/modals/vendors/orders/moving/moving_order_main.modal";

export const MovingOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<IMovingOrderTab>("all");
  return (
    <MovingModalProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moving Orders</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your moving orders
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as IMovingOrderTab)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="in_processing">In Processing</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <MovingOrdersTable activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
      <MovingOrderMainModal />
    </MovingModalProvider>
  );
};
