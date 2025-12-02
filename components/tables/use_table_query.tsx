import { useState, useEffect, useCallback } from "react";

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

type QueryParams<T> = T & {
  search?: string;
  page?: number;
  page_size?: number;
};

interface UseQueryTableProps<T extends Record<string, unknown>> {
  initialParams?: Partial<T>;
  initialPagination?: PaginationState;
  onParamsChange?: (params: QueryParams<T>) => void;
  debounceTime?: number;
}

export function useQueryTable<T extends Record<string, unknown>>({
  initialParams = {} as Partial<T>,
  initialPagination = { pageIndex: 0, pageSize: 10 },
  debounceTime = 500,
}: UseQueryTableProps<T>) {
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const [queryParams, setQueryParams] = useState<QueryParams<T>>({
    ...(initialParams as T),
  });
  const combinedParams = useCallback(
    () => ({
      ...queryParams,
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
    }),
    [pagination, queryParams]
  );

  // Handle search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({
        ...prev,
        search: searchTerm,
      }));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceTime]);

  const updateParams = useCallback((updates: Partial<T>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...updates,
    }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return {
    pagination,
    setPagination,
    queryParams: combinedParams(),
    updateParams,
    searchTerm,
    handleSearchChange: useCallback(
      (event: React.ChangeEvent<HTMLInputElement> | string) => {
        const value = typeof event === "string" ? event : event.target.value;
        setSearchTerm(value);
      },
      []
    ),
  };
}
