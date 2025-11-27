"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectProps } from "@radix-ui/react-select";
import { TrendingUp, TrendingDown } from "lucide-react";
import * as React from "react";

// Types
interface SelectOption {
  value: string;
  label: string;
}

type StatCardProps = React.HTMLAttributes<HTMLDivElement>;

type StatCardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

type StatCardTitleProps = React.HTMLAttributes<HTMLDivElement>;

interface StatCardSelectProps extends Omit<SelectProps, "children"> {
  options: SelectOption[];
  placeholder?: string;
}

type StatCardContentProps = React.HTMLAttributes<HTMLDivElement>;

type StatCardVariant = "blue" | "purple";

interface StatItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The label/title text displayed at the top of the card */
  label: string;
  /** The main value displayed prominently */
  value: string | number;
  /** Card background variant - "blue" for primary-blue, "purple" for primary-purple */
  variant?: StatCardVariant;
  /** Optional percentage change (e.g., "+11.01%" or "-0.03%") */
  percentageChange?: string;
  /** Whether the change is positive (up arrow) or negative (down arrow) - auto-detected if not provided */
  isPositive?: boolean;
}

// Components
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 rounded-2xl bg-card space-y-2.5", className)}
      {...props}
    />
  )
);
StatCard.displayName = "StatCard";

const StatCardHeader = React.forwardRef<HTMLDivElement, StatCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between w-full", className)}
      {...props}
    />
  )
);
StatCardHeader.displayName = "StatCardHeader";

const StatCardTitle = React.forwardRef<HTMLDivElement, StatCardTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-1 font-normal text-sm text-title font-manrope",
        className
      )}
      {...props}
    />
  )
);
StatCardTitle.displayName = "StatCardTitle";

const StatCardSelect = ({
  options,
  defaultValue,
  onValueChange,
  placeholder,
  ...props
}: StatCardSelectProps) => (
  <Select
    {...props}
    defaultValue={defaultValue}
    onValueChange={(e) => {
      onValueChange?.(e);
    }}
  >
    <SelectTrigger className="border-none shadow-none p-0 h-auto gap-1 font-manrope text-sm text-title">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="border border-border ring-0">
      {options.map((option) => (
        <SelectGroup key={option.value}>
          <SelectItem value={option.value}>{option.label}</SelectItem>
        </SelectGroup>
      ))}
    </SelectContent>
  </Select>
);
StatCardSelect.displayName = "StatCardSelect";

const StatCardContent = React.forwardRef<HTMLDivElement, StatCardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7",
        className
      )}
      {...props}
    />
  )
);
StatCardContent.displayName = "StatCardContent";

const StatItem = React.forwardRef<HTMLDivElement, StatItemProps>(
  (
    {
      label,
      value,
      variant = "blue",
      percentageChange,
      isPositive,
      className,
      ...props
    },
    ref
  ) => {
    // Auto-detect if change is positive based on the percentage string
    const isChangePositive =
      isPositive ??
      (percentageChange ? !percentageChange.startsWith("-") : true);

    const variantStyles: Record<StatCardVariant, string> = {
      blue: "bg-primary-blue",
      purple: "bg-primary-purple",
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex flex-col gap-2 p-6 rounded-2xl min-w-[200px] h-[112px] font-manrope",
          variantStyles[variant],
          className
        )}
      >
        {/* Label */}
        <p className="text-sm font-normal text-title leading-[1.5]">{label}</p>

        {/* Value and Percentage Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Main Value */}
          <p className="text-2xl font-semibold text-title leading-[1.4]">
            {value}
          </p>

          {/* Optional Percentage Change */}
          {percentageChange && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-title tracking-[0.5px] leading-[1.4]">
                {percentageChange}
              </span>
              {isChangePositive ? (
                <TrendingUp className="size-4 text-title" />
              ) : (
                <TrendingDown className="size-4 text-title" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
StatItem.displayName = "StatItem";

export {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatCardTitle,
  StatItem,
  type SelectOption,
  type StatCardContentProps,
  type StatCardHeaderProps,
  type StatCardProps,
  type StatCardSelectProps,
  type StatCardTitleProps,
  type StatItemProps,
  type StatCardVariant,
};
