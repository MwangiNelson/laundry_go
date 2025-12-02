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
import { Table_Wrapper } from "../../table_wrapper";
import { useQueryTable } from "../../use_table_query";
import { transactionsColumns } from "./transactions.column";
import { getTransactionsData, TransactionTab } from "./transactions.data";

export const TransactionsTable = () => {
  const [activeTab, setActiveTab] = useState<TransactionTab>("all");
  const { searchTerm, handleSearchChange } = useQueryTable({
    initialParams: {
      search: "",
      status: "",
    },
  });

  const tabs = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "refunded", label: "Refunded" },
  ];

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TransactionTab)}
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
              columns={transactionsColumns}
              data={getTransactionsData(tab.value as TransactionTab)}
              onRowClick={(row) => {
                console.log("Row clicked:", row);
                // TODO: Add navigation or modal to view transaction details
              }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
