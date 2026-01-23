"use client";

import React from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { transactionsColumns, type AdminTransactionRow } from "./transactions.column";
import { useQueryTable } from "../../use_table_query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useAdminTransactionsPage } from "@/api/admin/transactions/use_transactions_admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TxStatus = "all" | "paid" | "pending" | "failed" | "refunded";

export const AdminTransactionsTable = () => {
  const { handleSearchChange, pagination, searchTerm, setPagination, updateParams, queryParams } =
    useQueryTable<{
      status?: TxStatus;
    }>({
      initialParams: {
        status: "all",
      },
    });

  const { data: page, isLoading } = useAdminTransactionsPage({
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    search: searchTerm,
    status: (queryParams.status || "all") as TxStatus,
    sort_by: "paid_at",
    sort_order: "DESC",
  });

  const rows = (page?.data ?? []) as AdminTransactionRow[];

  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              placeholder="Search vendor or customer..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 bg-card border rounded-[12px] w-[260px] h-[42px] text-muted-foreground text-[14px]"
            />
          </div>

          <Select
            value={(queryParams.status as string) || "all"}
            onValueChange={(v) => updateParams({ status: v as TxStatus })}
          >
            <SelectTrigger className="h-[42px] w-[160px] rounded-[12px] bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
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
        columns={transactionsColumns}
        data={rows}
        enableRowSelection
        loading={isLoading}
        tableOptions={{
          manualPagination: true,
          pageCount: page ? Math.ceil(page.total_count / pagination.pageSize) : 0,
          getRowId: (row: AdminTransactionRow) => row.order_id,
          state: {
            pagination: {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            },
          },
          onPaginationChange: setPagination,
        }}
        table_header="Transactions"
      />
    </div>
  );
};

