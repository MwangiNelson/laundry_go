"use client";
import React, { useState } from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { servicesColumns } from "./admin_services.columns";
import { useQueryTable } from "../../use_table_query";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useServiceAnalytics } from "@/api/admin/services/use_service_analytics";

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
    initialParams: {},
  });
  const { data: services, isLoading, error } = useServiceAnalytics();
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
        data={services || []}
        enableRowSelection
        loading={isLoading}
        tableOptions={{
          manualPagination: true,
          pageCount: 1,
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
