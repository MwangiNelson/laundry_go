"use client";
import React from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { ridersColumns } from "./riders.column";
import { RiderTab } from "./riders.data";
import { useQueryTable } from "../../use_table_query";
import { useFetchRiders } from "@/api/vendor/riders/use_fetch_rider";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { CustomTabList } from "@/components/pageUIs/shared/shared_tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export const RidersTable = () => {
  const { vendor } = useVendor();
  const [activeTab, setActiveTab] = React.useState<RiderTab>("all");
  const { pagination, setPagination, searchTerm, handleSearchChange } =
    useQueryTable({
      initialParams: {},
    });

  const { data, isLoading } = useFetchRiders({
    vendor_id: vendor?.id || "",
    search: searchTerm,
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    status: activeTab === "all" ? undefined : activeTab,
  });

  return (
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
          <Table_Wrapper
            columns={ridersColumns}
            data={data?.data || []}
            enableRowSelection
            tableOptions={{
              pageCount: data?.total_count,
              manualPagination: true,
              manualFiltering: true,
              onPaginationChange: setPagination,
              state: {
                pagination,
              },
            }}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

const tabs = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
