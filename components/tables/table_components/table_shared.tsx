import React, { Dispatch, SetStateAction, useEffect } from "react";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Table_Wrapper } from "./table_wrapper";
type Props<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  isPending?: boolean;
  onRowClick?: (row: T) => void;
  pageCount?: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: Dispatch<
    SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
  Filters?: React.FC<{
    table: Table<T>;
  }>;
};

export function TableShared<T extends object>(props: Props<T>) {
  const {
    columns,
    data,
    isPending,
    onRowClick,
    pageCount,
    pagination,
    setPagination,
    Filters,
  } = props;
  return (
    <Table_Wrapper
      columns={columns}
      data={data}
      columnVisibilitySelector={false}
      loading={isPending}
      hideToolbar={true}
      Filters={Filters}
      onRowClick={onRowClick}
      tableOptions={{
        pageCount: pageCount ?? -1,
        manualPagination: true,
        manualFiltering: true,
        onPaginationChange: setPagination,
        state: {
          pagination,
        },
      }}
    />
  );
}
