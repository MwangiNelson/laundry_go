"use client";
import React, { useState, useEffect } from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { customersColumns } from "./customers.column";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useFetchCustomers } from "@/api/admin/customers/use_customers";
import { useQueryTable } from "../../use_table_query";
import { useCustomerModal } from "@/components/context/customers_modal_provider";

type CustomerTab = "all" | "active" | "inactive";

const convertTabToStatus = (tab: CustomerTab): string | undefined => {
  if (tab === "all") return undefined;
  return tab;
};

export const CustomersTable = () => {
  const [activeTab, setActiveTab] = useState<CustomerTab>("all");
  const { openModal } = useCustomerModal();

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
      status: convertTabToStatus(activeTab),
      sortBy: "created_at",
      sortOrder: "DESC",
    },
  });

  // Update status when tab changes
  useEffect(() => {
    updateParams({
      status: convertTabToStatus(activeTab),
    });
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
  }, [activeTab]);

  // Fetch customers with filters
  const { data: customersData, isLoading } = useFetchCustomers({
    status: queryParams.status,
    search: searchTerm,
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    sort_by: queryParams.sortBy || "created_at",
    sort_order: queryParams.sortOrder || "DESC",
  });

  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 bg-card border rounded-[12px] w-[200px] h-[42px] text-muted-foreground text-[14px]"
            />
          </div>
        </div>
      </div>

      <Table_Wrapper
        columns={customersColumns}
        data={customersData?.data ?? []}
        enableRowSelection
        loading={isLoading}
        onRowClick={(row) => {
          const customerId = row.id;
          console.log({ customerId });
          if (customerId) {
            openModal(customerId);
          }
        }}
        tableOptions={{
          manualPagination: true,
          pageCount: customersData?.page_count ?? 0,
          state: {
            pagination: {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            },
          },
          onPaginationChange: setPagination,
        }}
      />
    </div>
  );
};
