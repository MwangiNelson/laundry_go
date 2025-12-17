"use client";
import React, { useMemo } from "react";
import { Table_Wrapper } from "../../table_wrapper";
import { servicesColumns } from "./services.column";
import { useQueryTable } from "../../use_table_query";
import { useFetchServices } from "@/api/vendor/services/use_fetch_services";
import { useAuth } from "@/components/context/auth_provider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import {
  DataTableMultiFilter,
  FilterItem,
} from "@/components/tables/table_components/data_table_multi_filters";

export const ServicesTable = () => {
  const { vendor_id } = useAuth();

  const {
    pagination,
    setPagination,
    searchTerm,
    handleSearchChange,
    queryParams,
    updateParams,
  } = useQueryTable<{
    mainServiceId?: number;
    serviceItemId?: string;
    availability?: string;
  }>({
    initialParams: {
      mainServiceId: undefined,
      serviceItemId: undefined,
      availability: undefined,
    },
  });

  // Fetch all services to get unique main services and service items
  const { data: allServicesData } = useFetchServices({
    vendor_id: vendor_id || "",
    page: 1,
    page_size: 1000,
  });

  // Extract unique main services
  const mainServices = useMemo(() => {
    if (!allServicesData?.data) return [];
    const uniqueServices = new Map();
    allServicesData.data.forEach((service) => {
      if (
        service.main_service &&
        !uniqueServices.has(service.main_service.id)
      ) {
        uniqueServices.set(service.main_service.id, service.main_service);
      }
    });
    return Array.from(uniqueServices.values());
  }, [allServicesData]);

  // Extract unique service items (filtered by main service)
  const serviceItems = useMemo(() => {
    if (!allServicesData?.data) return [];
    const filteredData = queryParams.mainServiceId
      ? allServicesData.data.filter(
          (s) => s.main_service.id === queryParams.mainServiceId
        )
      : allServicesData.data;

    const uniqueItems = new Map();
    filteredData.forEach((service) => {
      if (service.service_item && !uniqueItems.has(service.service_item.id)) {
        uniqueItems.set(service.service_item.id, service.service_item);
      }
    });
    return Array.from(uniqueItems.values());
  }, [allServicesData, queryParams.mainServiceId]);

  // Fetch filtered services data
  const { data } = useFetchServices({
    vendor_id: vendor_id || "",
    search: searchTerm,
    page: pagination.pageIndex + 1,
    page_size: pagination.pageSize,
    main_service_id: queryParams.mainServiceId,
    service_item_id: queryParams.serviceItemId,
  });

  // Filter by availability status on client side
  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    if (!queryParams.availability) return data.data;
    return data.data.filter((service) =>
      queryParams.availability === "available"
        ? service.is_available
        : !service.is_available
    );
  }, [data, queryParams.availability]);

  // Prepare filter options
  const filters: FilterItem[] = useMemo(
    () => [
      {
        id: "mainService",
        label: "Main Service",
        options: mainServices.map((ms) => ({
          label: ms.service,
          value: ms.id.toString(),
        })),
        value: queryParams.mainServiceId?.toString(),
        onChange: (value) => {
          updateParams({
            mainServiceId: value ? parseInt(value) : undefined,
            serviceItemId: undefined, // Reset service item when main service changes
          });
        },
      },
      {
        id: "serviceItem",
        label: "Service Item",
        options: serviceItems.map((si) => ({
          label: si.name,
          value: si.id,
        })),
        value: queryParams.serviceItemId,
        onChange: (value) => {
          updateParams({ serviceItemId: value });
        },
        disabled: !queryParams.mainServiceId,
      },
      {
        id: "availability",
        label: "Availability",
        options: [
          { label: "Available", value: "available" },
          { label: "Unavailable", value: "unavailable" },
        ],
        value: queryParams.availability,
        onChange: (value) => {
          updateParams({ availability: value });
        },
      },
    ],
    [mainServices, serviceItems, queryParams, updateParams]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Filters and Search */}
      <div className="flex justify-between items-center">
        <DataTableMultiFilter
          title="Filter"
          filters={filters}
          onClearAll={() => {
            updateParams({
              mainServiceId: undefined,
              serviceItemId: undefined,
              availability: undefined,
            });
          }}
        />
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

      {/* Table */}
      <Table_Wrapper
        columns={servicesColumns}
        data={filteredData}
        enableRowSelection
        tableOptions={{
          pageCount: Math.ceil((data?.total_count || 0) / pagination.pageSize),
          manualPagination: true,
          manualFiltering: true,
          onPaginationChange: setPagination,
          state: {
            pagination,
          },
        }}
      />
    </div>
  );
};
