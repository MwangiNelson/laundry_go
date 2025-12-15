"use client";
import React, { useMemo, useEffect } from "react";
import { Table_Wrapper } from "../../../table_wrapper";
import { movingOrdersColumns } from "./moving_orders.column";
import { convertTabToDbStatus, IMovingOrderTab } from "./moving_orders.data";
import { useMovingModal } from "../../../../modals/vendors/orders/moving/use_moving_modal";
import { useQueryTable } from "@/components/tables/use_table_query";
import { Search, Filter, ArrowDownNarrowWide, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useFetchOrders } from "@/api/vendor/order/use_fetch_orders";
import { useFetchRiders } from "@/api/vendor/riders/use_fetch_rider";
import { useFetchServiceItems } from "@/api/vendor/order/use_fetch_service_items";
import { useFetchServiceOptions } from "@/api/vendor/order/use_fetch_service_options";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import {
  DataTableMultiFilter,
  FilterItem,
} from "@/components/tables/table_components/data_table_multi_filters";

interface MovingOrdersTableProps {
  activeTab: IMovingOrderTab;
}

export const MovingOrdersTable = ({ activeTab }: MovingOrdersTableProps) => {
  const { openModal } = useMovingModal();
  const { vendor } = useVendor();

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
    riderId?: string;
    serviceItemId?: string;
    serviceOptionId?: string;
  }>({
    initialParams: {
      status: convertTabToDbStatus(activeTab),
      sortBy: "created_at",
      sortOrder: "DESC",
      riderId: undefined,
      serviceItemId: undefined,
      serviceOptionId: undefined,
    },
  });

  useEffect(() => {
    updateParams({
      status: convertTabToDbStatus(activeTab),
    });
  }, [activeTab, updateParams]);

  const { data: ordersData, isLoading } = useFetchOrders({
    vendor_id: vendor?.id,
    main_service_slug: "moving",
    status: queryParams.status,
    search: searchTerm,
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    rider_id: queryParams.riderId,
    service_item_id: queryParams.serviceItemId,
    service_option_id: queryParams.serviceOptionId,
    sort_by: queryParams.sortBy || "created_at",
    sort_order: queryParams.sortOrder || "DESC",
  });

  const { data: ridersData } = useFetchRiders({
    vendor_id: vendor?.id || "",
    status: "active",
  });

  const { data: serviceItems } = useFetchServiceItems({
    main_service_id: 2,
  });

  const { data: serviceOptions } = useFetchServiceOptions({
    service_item_id: queryParams.serviceItemId,
  });

  const sortFilters: FilterItem[] = useMemo(
    () => [
      {
        id: "sortBy",
        label: "Sort By",
        options: [
          { label: "Created Date", value: "created_at" },
          { label: "Total Price", value: "total_price" },
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
    ],
    [queryParams.sortBy, queryParams.sortOrder, updateParams]
  );

  const dataFilters: FilterItem[] = useMemo(
    () => [
      {
        id: "riderId",
        label: "Rider",
        options:
          ridersData?.data?.map((rider) => ({
            label: rider.user?.full_name || rider.user?.email || "Unknown",
            value: rider.id,
          })) || [],
        value: queryParams.riderId,
        onChange: (value: string | undefined) =>
          updateParams({ riderId: value }),
      },
      {
        id: "serviceItemId",
        label: "Service Item",
        options:
          serviceItems?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || [],
        value: queryParams.serviceItemId,
        onChange: (value: string | undefined) => {
          updateParams({ serviceItemId: value, serviceOptionId: undefined });
        },
      },
      {
        id: "serviceOptionId",
        label: "Service Option",
        options:
          serviceOptions?.map((option) => ({
            label: option.name,
            value: option.id,
          })) || [],
        value: queryParams.serviceOptionId,
        onChange: (value: string | undefined) =>
          updateParams({ serviceOptionId: value }),
        disabled: !queryParams.serviceItemId,
      },
    ],
    [
      ridersData?.data,
      serviceItems,
      serviceOptions,
      queryParams.riderId,
      queryParams.serviceItemId,
      queryParams.serviceOptionId,
      updateParams,
    ]
  );

  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="flex items-center justify-end gap-4 px-1 self-end md:self-center w-full ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            placeholder="Search by customer..."
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

        <DataTableMultiFilter
          title="Filter"
          filters={dataFilters}
          triggerIcon={Filter}
          onClearAll={() => {
            updateParams({
              riderId: undefined,
              serviceItemId: undefined,
              serviceOptionId: undefined,
            });
          }}
        />

        <Button
          variant={"ghost"}
          className="h-10 px-4 py-2 rounded-lg border bg-transparent text-muted-foreground hover:bg-accent"
        >
          <Download />
          <span>Export</span>
        </Button>
      </div>

      <Table_Wrapper
        columns={movingOrdersColumns}
        data={ordersData?.data ?? []}
        enableRowSelection
        loading={isLoading}
        tableOptions={{
          manualPagination: true,
          pageCount: ordersData
            ? Math.ceil(ordersData.total_count / pagination.pageSize)
            : 0,
          state: {
            pagination: {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            },
          },
          onPaginationChange: setPagination,
        }}
        onRowClick={(row) => {
          if (!(activeTab == "all")) {
            openModal({
              orderId: (row as { id: string }).id,
              orderStatus: activeTab,
            });
          }
        }}
      />
    </div>
  );
};
