"use client";

import React from "react";
import {
  StatCard,
  StatCardContent,
  StatCardHeader,
  StatCardSelect,
  StatItem,
} from "@/components/pageUIs/shared/start_cards";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useGenerateOrdersReports } from "@/api/vendor/reports/use_generate_reports";
import { downloadOrdersReportCsv } from "@/components/utils/exel_orders_generator";

const StatSection = () => (
  <StatCard>
    <StatCardHeader>
      <StatCardSelect
        options={[
          { value: "month", label: "This Month" },
          { value: "quarter", label: "This Quarter" },
          { value: "year", label: "This Year" },
        ]}
        defaultValue="month"
      />
    </StatCardHeader>
    <StatCardContent>
      <StatItem label="Total Orders" value="125,600" variant="blue" />
      <StatItem label="Total Complete Orders" value="24,000" variant="purple" />
      <StatItem
        label="Income from Service (kes)"
        value="18,500"
        variant="blue"
      />
      <StatItem
        label="Income from delivery costs (kes)"
        value="41,300"
        variant="purple"
      />
    </StatCardContent>
  </StatCard>
);

interface ReportCardProps {
  title: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  onChangeStartDate?: (date?: Date) => void;
  onChangeEndDate?: (date?: Date) => void;
  onDownloadXls?: () => void;
  onDownloadPdf?: () => void;
  disableDownload?: boolean;
}

const ReportCard = ({
  title,
  description,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onDownloadXls,
  onDownloadPdf,
  disableDownload,
}: ReportCardProps) => {
  const renderDatePicker = (
    label: string,
    date: Date | undefined,
    onSelect: (date?: Date) => void
  ) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-12 justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PP") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 bg-card border border-border rounded-2xl p-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-title">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-title">Report Duration</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {renderDatePicker(
            "Start From",
            startDate,
            onChangeStartDate ?? (() => {})
          )}
          {renderDatePicker("End", endDate, onChangeEndDate ?? (() => {}))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="h-11"
          onClick={onDownloadPdf}
          disabled={disableDownload}
        >
          Download PDF
        </Button>
        <Button
          variant="outline"
          className="h-11"
          onClick={onDownloadXls}
          disabled={disableDownload}
        >
          Download Xls
        </Button>
      </div>
    </div>
  );
};

export const ReportsPageUI = () => {
  const [ordersStartDate, setOrdersStartDate] = React.useState<
    Date | undefined
  >();
  const [ordersEndDate, setOrdersEndDate] = React.useState<Date | undefined>();

  const { data: orders } = useGenerateOrdersReports({
    startDate: ordersStartDate,
    endDate: ordersEndDate,
  });

  const handleDownloadOrdersXls = () => {
    console.log("Downloading orders XLS");
    downloadOrdersReportCsv(orders, "orders-report.csv");
  };

  return (
    <div className="p-6 space-y-6">
      <StatSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportCard
          title="Orders Report"
          description="Generate a summarized report showcasing the total orders you've received, their current status for the duration you select in PDF or Excel format."
          startDate={ordersStartDate}
          endDate={ordersEndDate}
          onChangeStartDate={setOrdersStartDate}
          onChangeEndDate={setOrdersEndDate}
          onDownloadXls={handleDownloadOrdersXls}
          disableDownload={!orders || orders.length === 0}
        />
        <ReportCard
          title="Financial Report"
          description="Generate a financial report with your total incomes from servicing orders to internally handled deliveries for the duration you select in PDF or Excel format."
          disableDownload
        />
      </div>
    </div>
  );
};
