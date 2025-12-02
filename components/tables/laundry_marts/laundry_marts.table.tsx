"use client";
import { CustomTabList } from "@/components/pageUIs/shared/shared_tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { Table_Wrapper } from "../table_wrapper";
import { useQueryTable } from "../use_table_query";
import {
  laundryMartsColumns,
  getHiddenLaundryMartsColumns,
} from "./laundry_marts.column";
import { getLaundryMartsData, LaundryMartTab } from "./laundry_marts.data";

export const LaundryMartsTable = () => {
  const [activeTab, setActiveTab] = useState<LaundryMartTab>("all");
  const { searchTerm, handleSearchChange } = useQueryTable({
    initialParams: {
      search: "",
      status: "",
    },
  });

  const tabs = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ];

  return (
    <div className="space-y-4 bg-card rounded-2xl p-6">
      <h1 className="text-lg font-bold text-title font-manrope">
        Laundry Mart List
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as LaundryMartTab)}
      >
        <div className="flex justify-between items-center mb-4">
          <CustomTabList tabs={tabs} />
          <InputGroup className="max-w-48 shadow-none">
            <InputGroupInput
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {tabs.map((tab) => (
          <TabsContent value={tab.value} key={tab.value} className="mt-4">
            <Table_Wrapper
              columns={laundryMartsColumns}
              data={getLaundryMartsData(tab.value as LaundryMartTab)}
              hiddenColumns={getHiddenLaundryMartsColumns(
                tab.value as LaundryMartTab
              )}
              onRowClick={(row) => {
                console.log("Row clicked:", row);
                // TODO: Add navigation or modal to view laundry mart details
              }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
