"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TTable,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  TableOptions,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTablePagination } from "./table_pagination";

// Type helper to extract column IDs from column definitions
type ExtractColumnIds<TData, TValue> =
  | (TData extends Record<string, unknown> ? keyof TData : never)
  | string;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  Filters?: React.FC<{
    table: TTable<TData>;
  }>;
  searchField?: keyof TData;
  hideToolbar?: boolean;
  onRowClick?: (row: TData) => void;
  columnVisibilitySelector?: boolean;
  tableOptions?: Partial<TableOptions<TData>>;
  table_header?: string;
  customComponents?: {
    Toolbar?: React.FC<{ table: TTable<TData> }>;
    Header?: React.FC<{ table: TTable<TData> }>;
    Body?: React.FC<{ table: TTable<TData> }>;
    Pagination?: React.FC<{ table: TTable<TData> }>;
  };
  className?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  handleFilterReset?: () => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  enableRowSelection?: boolean;
  hiddenColumns?: ExtractColumnIds<TData, TValue>[]; // Array of column IDs with autocomplete
}

export const Table_Wrapper = <TData, TValue>({
  columns,
  data,
  loading,
  Filters,
  hideToolbar = false,
  onRowClick,
  columnVisibilitySelector = true,
  tableOptions = {},
  customComponents = {},
  className,
  onRowSelectionChange,
  enableRowSelection = false,
  hiddenColumns = [],
}: DataTableProps<TData, TValue>) => {
  const createCheckboxColumn = (): ColumnDef<TData, TValue> => ({
    id: "select",
    accessorKey: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(checked) => {
          console.log("Header checkbox clicked:", checked);
          table.toggleAllRowsSelected(!!checked);
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        disabled={!row.getCanSelect()}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => {
          row.toggleSelected(!!checked);
        }}
      />
    ),
  });
  const finalColumns = enableRowSelection
    ? [createCheckboxColumn(), ...columns]
    : columns;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Initialize column visibility based on hiddenColumns prop
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      const initialVisibility: VisibilityState = {};
      hiddenColumns.forEach((columnId) => {
        initialVisibility[columnId as string] = false;
      });
      return initialVisibility;
    });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleRowSelectionChange = React.useCallback(
    (updater: unknown) => {
      // Handle both function and value updaters
      const newRowSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;

      setRowSelection(newRowSelection);

      if (onRowSelectionChange) {
        const selectedRows = Object.keys(newRowSelection)
          .filter((key) => newRowSelection[key])
          .map((key) => {
            const row =
              data.find((item) => (item as { id?: string }).id === key) ||
              data.find((_, index) => index.toString() === key);
            return row;
          })
          .filter(Boolean) as TData[];
        onRowSelectionChange(selectedRows);
      }
    },
    [onRowSelectionChange, data, rowSelection]
  );

  const defaultTableOptions: TableOptions<TData> = {
    data,
    columns: finalColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row, index) =>
      (row as unknown as { id?: string }).id || index.toString(),
  };

  const {
    onRowSelectionChange: _,
    enableRowSelection: __,
    getRowId: ___,
    ...restTableOptions
  } = tableOptions;

  const mergedTableOptions = {
    ...defaultTableOptions,
    ...restTableOptions,
    state: {
      ...defaultTableOptions.state,
      ...restTableOptions.state,
      rowSelection, // Ensure row selection state is preserved
    },
    // CRITICAL: These must be preserved and not overridden
    onRowSelectionChange: handleRowSelectionChange,
    enableRowSelection: enableRowSelection,
    getRowId: defaultTableOptions.getRowId,
  };

  const table = useReactTable(mergedTableOptions);
  const DefaultHeader: React.FC<{ table: TTable<TData> }> = ({ table }) => (
    <TableHeader className="bg-accent/70   ">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="h-14">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="font-semibold text-foreground/90 "
              style={{
                minWidth: `${header.getSize()}px`,
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );

  const DefaultBody: React.FC<{ table: TTable<TData> }> = ({ table }) => {
    const pagination = table.getState().pagination;

    return (
      <TableBody suppressHydrationWarning className="min-h-[400px] bg-card">
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              onClick={(e) => {
                // Don't trigger row click if clicking on checkbox or other interactive elements
                if (
                  (e.target as HTMLElement).closest(
                    'input[type="checkbox"], button, [role="button"]'
                  )
                ) {
                  return;
                }
                onRowClick?.(row.original);
              }}
              className="cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  suppressHydrationWarning
                  className="text-foreground/90 py-3 text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-60 text-center">
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <h3 className="text-lg font-medium text-foreground">
                  No data available
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  There doesnt seem to be any data available in this table at
                  the moment. Try changing your filters or check back later.
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  };

  const {
    Toolbar,
    Header = DefaultHeader,
    Body = DefaultBody,
    Pagination = DataTablePagination,
  } = customComponents;
  const [mount, setMount] = React.useState(false);
  React.useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;
  return (
    <div className={`   ${className}`}>
      {!hideToolbar && (
        <div className="px-2">{Toolbar && <Toolbar table={table} />}</div>
      )}
      <div className="border  w-full  rounded-lg overflow-hidden">
        <Table>
          <Header table={table} />
          <Body table={table} />
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  );
};
