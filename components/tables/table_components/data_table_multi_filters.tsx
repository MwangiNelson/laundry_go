import React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, Minus, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CiSquareMinus } from "react-icons/ci";

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterItem {
  id: string;
  label: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
}

export interface MultiFilterProps {
  title?: string;
  filters: FilterItem[];
  triggerIcon?: React.ComponentType<{ className?: string }>;
  onClearAll?: () => void;
}

export function DataTableMultiFilter({
  title,
  filters,
  triggerIcon: TriggerIcon = Filter,
  onClearAll,
}: MultiFilterProps) {
  // Calculate total active filters
  const activeFiltersCount = filters.filter((f) => f.value).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const clearFilters = () => {
    filters.forEach((filter) => filter.onChange(undefined));
    onClearAll?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-10 border   rounded-lg bg-card  text-sm text-muted-foreground relative px-4 hover:bg-muted-foreground/5 hover:border-muted-foreground/30 transition-all duration-200 flex items-center gap-2">
          <TriggerIcon className="h-4 w-4 text-primary" />
          {title && <span className="font-medium">{title}</span>}
          {hasActiveFilters && (
            <>
              <Separator
                orientation="vertical"
                className="mx-1 h-4 bg-muted-foreground/30"
              />
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground border-0"
              >
                {activeFiltersCount}
              </Badge>
            </>
          )}
          {title && (
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-0 border border-border shadow-lg rounded-xl bg-background"
        align="start"
      >
        <div className="rounded-xl overflow-hidden">
          <div className="flex flex-row items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
              >
                <CiSquareMinus className="h-3 w-3 mr-1" />
                <span>Clear</span>
              </Button>
            )}
          </div>
          <div className="space-y-3 px-4 py-4">
            {filters
              .filter((filter) => !filter.hidden)
              .map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between"
                >
                  <label
                    className={cn(
                      "text-sm font-medium text-foreground",
                      (filter.disabled || filter.readonly) &&
                        "text-muted-foreground"
                    )}
                  >
                    {filter.label}:
                  </label>
                  {filter.readonly ? (
                    <div className="w-[150px] h-8 px-3 rounded-md border border-border bg-muted/30 flex items-center text-sm">
                      {filter.options.find((opt) => opt.value === filter.value)
                        ?.label ||
                        filter.value ||
                        "Not set"}
                    </div>
                  ) : (
                    <Select
                      value={filter.value || ""}
                      onValueChange={filter.onChange}
                      disabled={filter.disabled}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[150px] h-8 text-sm border border-border bg-background hover:bg-muted/50 transition-colors",
                          filter.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <SelectValue
                          placeholder={
                            filter.disabled
                              ? "Select level first"
                              : `Select ${filter.label.toLowerCase()}`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.icon && (
                                <option.icon className="h-4 w-4 text-muted-foreground" />
                              )}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export function MultiFilterExample() {
  const [sortFilters, setSortFilters] = React.useState<FilterItem[]>([
    {
      id: "engagement",
      label: "Engagement",
      value: "highest-to-lowest",
      options: [
        { label: "Highest to lowest", value: "highest-to-lowest" },
        { label: "Lowest to highest", value: "lowest-to-highest" },
      ],
      onChange: (value) => {
        setSortFilters((prev) =>
          prev.map((f) => (f.id === "engagement" ? { ...f, value } : f))
        );
      },
    },
    {
      id: "earnings",
      label: "Earnings",
      value: "lowest-to-highest",
      options: [
        { label: "Highest to lowest", value: "highest-to-lowest" },
        { label: "Lowest to highest", value: "lowest-to-highest" },
      ],
      onChange: (value) => {
        setSortFilters((prev) =>
          prev.map((f) => (f.id === "earnings" ? { ...f, value } : f))
        );
      },
    },
    {
      id: "date-joined",
      label: "Date Joined",
      value: "earliest-to-latest",
      options: [
        { label: "Earliest to latest", value: "earliest-to-latest" },
        { label: "Latest to earliest", value: "latest-to-earliest" },
      ],
      onChange: (value) => {
        setSortFilters((prev) =>
          prev.map((f) => (f.id === "date-joined" ? { ...f, value } : f))
        );
      },
    },
  ]);

  const [dataFilters, setDataFilters] = React.useState<FilterItem[]>([
    {
      id: "review-status",
      label: "Review Status",
      value: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      onChange: (value) => {
        setDataFilters((prev) =>
          prev.map((f) => (f.id === "review-status" ? { ...f, value } : f))
        );
      },
    },
    {
      id: "bonus-eligible",
      label: "Bonus Eligible",
      value: "eligible",
      options: [
        { label: "Eligible for bonus", value: "eligible" },
        { label: "Not eligible", value: "not-eligible" },
      ],
      onChange: (value) => {
        setDataFilters((prev) =>
          prev.map((f) => (f.id === "bonus-eligible" ? { ...f, value } : f))
        );
      },
    },
    {
      id: "platform",
      label: "Platform",
      value: "facebook",
      options: [
        { label: "Facebook", value: "facebook" },
        { label: "Instagram", value: "instagram" },
        { label: "TikTok", value: "tiktok" },
        { label: "Twitter", value: "twitter" },
      ],
      onChange: (value) => {
        setDataFilters((prev) =>
          prev.map((f) => (f.id === "platform" ? { ...f, value } : f))
        );
      },
    },
  ]);

  return (
    <div className="flex gap-2">
      <DataTableMultiFilter
        title="Sort"
        filters={sortFilters}
        triggerIcon={Filter}
        onClearAll={() => {
          setSortFilters((prev) =>
            prev.map((f) => ({ ...f, value: undefined }))
          );
        }}
      />
      <DataTableMultiFilter
        title="Filter"
        filters={dataFilters}
        triggerIcon={Filter}
        onClearAll={() => {
          setDataFilters((prev) =>
            prev.map((f) => ({ ...f, value: undefined }))
          );
        }}
      />
    </div>
  );
}
