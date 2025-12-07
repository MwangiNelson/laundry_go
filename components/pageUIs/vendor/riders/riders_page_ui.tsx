"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { CustomTabList } from "@/components/pageUIs/shared/shared_tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useQueryTable } from "@/components/tables/use_table_query";
import { RidersTable } from "@/components/tables/vendors/riders/riders.table";
import { RiderTab } from "@/components/tables/vendors/riders/riders.data";
import { CreateRiderModal } from "@/components/modals/riders/create_rider.modal";

const tabs = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "inProcess", label: "In Process" },
  { value: "ready", label: "Ready" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const RidersPageUI = () => {
  const [activeTab, setActiveTab] = useState<RiderTab>("all");
  const { searchTerm, handleSearchChange } = useQueryTable({
    initialParams: {
      search: "",
      status: "",
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-title font-manrope">
          Rider List
        </h1>
        <CreateRiderModal
          trigger={
            <Button>
              <PlusIcon />
              <span>Add Rider</span>
            </Button>
          }
        />
      </div>

      {/* Tabs and Search */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as RiderTab)}
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
            <RidersTable activeTab={tab.value as RiderTab} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
