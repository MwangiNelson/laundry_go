"use client";
import React, { useState } from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { servicesColumns, IService } from "./admin_services.columns";
import { useQueryTable } from "../../use_table_query";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual API call
const MOCK_SERVICES_DATA: IService[] = [
  {
    id: "1",
    name: "Laundry",
    total_vendors: 23,
    no_of_order_items: 345,
    ongoing_orders: 35,
  },
  {
    id: "2",
    name: "House Cleaning",
    total_vendors: 534,
    no_of_order_items: 324,
    ongoing_orders: 34,
  },
  {
    id: "3",
    name: "Office Cleaning",
    total_vendors: 823,
    no_of_order_items: 876,
    ongoing_orders: 87,
  },
  {
    id: "4",
    name: "Moving",
    total_vendors: 34,
    no_of_order_items: 654,
    ongoing_orders: 64,
  },
  {
    id: "5",
    name: "Fumigation",
    total_vendors: 823,
    no_of_order_items: 654,
    ongoing_orders: 54,
  },
];

export const AdminServicesTable = () => {
  const {
    handleSearchChange,
    pagination,
    queryParams,
    searchTerm,
    setPagination,
    updateParams,
  } = useQueryTable<{
    sortBy?: string;
    sortOrder?: string;
  }>({
    initialParams: {
      sortBy: "name",
      sortOrder: "ASC",
    },
  });

  // Filter services based on search term
  const filteredServices = MOCK_SERVICES_DATA.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total count and paginated data
  const totalCount = filteredServices.length;
  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = filteredServices.slice(startIndex, endIndex);

  const isLoading = false;

  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 bg-card border rounded-[12px] w-[200px] h-[42px] text-muted-foreground text-[14px]"
          />
        </div>

        <Button
          variant="ghost"
          className="h-10 px-4 py-2 rounded-lg border bg-transparent text-muted-foreground hover:bg-accent"
        >
          <Download className="mr-2 h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      <Table_Wrapper
        columns={servicesColumns}
        data={paginatedData}
        enableRowSelection
        loading={isLoading}
        tableOptions={{
          manualPagination: true,
          pageCount: Math.ceil(totalCount / pagination.pageSize),
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
