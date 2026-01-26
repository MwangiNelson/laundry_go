"use client";
import React, { useState, useEffect } from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { vendorsColumns } from "./vendors.column";
import { useQueryTable } from "../../use_table_query";
import { Search, Filter, ArrowDownNarrowWide, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetchVendors } from "@/api/admin/vendors/use_fetch_vendors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DataTableMultiFilter,
  FilterItem,
} from "@/components/tables/table_components/data_table_multi_filters";

export type IVendorTab = "pending" | "approved" | "rejected" | "suspended";

const convertTabToDbStatus = (tab: IVendorTab): string => {
  const statusMap: Record<IVendorTab, string> = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    suspended: "suspended",
  };
  return statusMap[tab];
};

export const VendorsTable = () => {
  const [activeTab, setActiveTab] = useState<IVendorTab>("pending");

  const {
    handleSearchChange,
    pagination,
    queryParams,
    searchTerm,
    setPagination,
    updateParams,
  } = useQueryTable<{
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }>({
    initialParams: {
      status: convertTabToDbStatus(activeTab),
      sortBy: "created_at",
      sortOrder: "DESC",
    },
  });

  // Update status when tab changes
  useEffect(() => {
    updateParams({
      status: convertTabToDbStatus(activeTab),
    });
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
  }, [activeTab]);

  // Fetch vendors with filters
  const { data: vendorsData, isLoading } = useFetchVendors({
    status: queryParams.status,
    search: searchTerm,
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    sort_by: queryParams.sortBy || "created_at",
    sort_order: queryParams.sortOrder || "DESC",
  });

  // Sort filters
  const sortFilters: FilterItem[] = [
    {
      id: "sortBy",
      label: "Sort By",
      options: [
        { label: "Created Date", value: "created_at" },
        { label: "Business Name", value: "business_name" },
        { label: "Status", value: "status" },
      ],
      value: queryParams.sortBy as string,
      onChange: (value: string | undefined) =>
        updateParams({ sortBy: value || "created_at" }),
    },
    {
      id: "sortOrder",
      label: "Order",
      options: [
        { label: "Descending", value: "DESC" },
        { label: "Ascending", value: "ASC" },
      ],
      value: queryParams.sortOrder as string,
      onChange: (value: string | undefined) =>
        updateParams({ sortOrder: value || "DESC" }),
    },
  ];

  return (
    <div className="space-y-4 flex flex-col w-full">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as IVendorTab)}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 bg-card border rounded-[12px] w-[200px] h-[42px] text-muted-foreground text-[14px]"
              />
            </div>

            <DataTableMultiFilter
              title="Sort"
              filters={sortFilters}
              triggerIcon={ArrowDownNarrowWide}
              onClearAll={() => {
                updateParams({
                  sortBy: "created_at",
                  sortOrder: "DESC",
                });
              }}
            />

            <Button
              variant="ghost"
              className="h-10 px-4 py-2 rounded-lg border bg-transparent text-muted-foreground hover:bg-accent"
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <Table_Wrapper
            columns={vendorsColumns}
            data={vendorsData?.data ?? []}
            enableRowSelection
            loading={isLoading}
            tableOptions={{
              manualPagination: true,
              pageCount: vendorsData
                ? Math.ceil(vendorsData.total_count / pagination.pageSize)
                : 0,
              state: {
                pagination: {
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                },
              },
              onPaginationChange: setPagination,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
