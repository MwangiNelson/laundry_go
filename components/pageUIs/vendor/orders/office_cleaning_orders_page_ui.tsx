"use client";
import React, { useState } from "react";
import { OfficeCleaningOrdersTable } from "@/components/tables/vendors/orders/office_cleaning_orders/office_cleaning_orders.table";
import { IOfficeCleaningOrderTab } from "@/components/tables/vendors/orders/office_cleaning_orders/office_cleaning_orders.data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfficeCleaningModalProvider } from "@/components/modals/vendors/orders/office_cleaning/use_office_cleaning_modal";
import { OfficeCleaningOrderMainModal } from "@/components/modals/vendors/orders/office_cleaning/office_cleaning_order_main.modal";

export const OfficeCleaningOrdersPageUI = () => {
  const [activeTab, setActiveTab] = useState<IOfficeCleaningOrderTab>("all");
  return (
    <OfficeCleaningModalProvider>
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
          onValueChange={(value) =>
            setActiveTab(value as IOfficeCleaningOrderTab)
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
            <OfficeCleaningOrdersTable activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
      <OfficeCleaningOrderMainModal />
    </OfficeCleaningModalProvider>
  );
};
