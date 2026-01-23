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
import { format, startOfMonth, startOfQuarter, startOfYear, endOfDay } from "date-fns";
import {
  useGenerateAdminFinancialReports,
  useGenerateAdminOrdersReports,
  useGenerateAdminPaymentsReport,
  useAdminReportStats,
} from "@/api/admin/reports/use_reports.admin";
import {
  downloadAdminOrdersReportCsv,
} from "@/components/utils/admin/generete_orders_report_xls";
import {
  downloadAdminFinancialReportCsv,
} from "@/components/utils/admin/generete_financial_report_xls";
import { AdminOrdersPDFDownloadButton } from "@/components/utils/admin/generete_orders_report_pdf";
import { AdminFinancialPDFDownloadButton } from "@/components/utils/admin/generete_financial_report_pdf";

type StatPeriod = "month" | "quarter" | "year";

const StatSection = ({
  period,
  onChangePeriod,
  stats,
}: {
  period: StatPeriod;
  onChangePeriod: (p: StatPeriod) => void;
  stats: Awaited<ReturnType<typeof useAdminReportStats>>["data"];
}) => (
  <StatCard>
    <StatCardHeader>
      <StatCardSelect
        options={[
          { value: "month", label: "This Month" },
          { value: "quarter", label: "This Quarter" },
          { value: "year", label: "This Year" },
        ]}
        defaultValue={period}
        onValueChange={(v) => onChangePeriod(v as StatPeriod)}
      />
    </StatCardHeader>
    <StatCardContent>
      <StatItem
        label="Total Orders"
        value={(stats?.total_orders ?? 0).toLocaleString()}
        variant="blue"
      />
      <StatItem
        label="Total Complete Orders"
        value={(stats?.total_completed_orders ?? 0).toLocaleString()}
        variant="purple"
      />
      <StatItem
        label="Income from Service (kes)"
        value={(stats?.income_from_service ?? 0).toLocaleString()}
        variant="blue"
      />
      <StatItem
        label="Income from delivery costs (kes)"
        value={(stats?.income_from_delivery ?? 0).toLocaleString()}
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
  pdfDownloadButton?: React.ReactNode;
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
  pdfDownloadButton,
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
        {pdfDownloadButton || (
          <Button
            variant="secondary"
            className="h-11"
            onClick={onDownloadPdf}
            disabled={disableDownload}
          >
            Download PDF
          </Button>
        )}
        <Button
          variant="outline"
          className="h-11"
          onClick={onDownloadXls}
          disabled={disableDownload}
        >
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export const AdminReportsPageUI = () => {
  const [statPeriod, setStatPeriod] = React.useState<StatPeriod>("month");
  const [ordersStartDate, setOrdersStartDate] = React.useState<Date | undefined>();
  const [ordersEndDate, setOrdersEndDate] = React.useState<Date | undefined>();
  const [financialStartDate, setFinancialStartDate] = React.useState<Date | undefined>();
  const [financialEndDate, setFinancialEndDate] = React.useState<Date | undefined>();

  // Compute stat period date range
  const statDateRange = React.useMemo(() => {
    const now = new Date();
    switch (statPeriod) {
      case "month":
        return { start: startOfMonth(now), end: endOfDay(now) };
      case "quarter":
        return { start: startOfQuarter(now), end: endOfDay(now) };
      case "year":
        return { start: startOfYear(now), end: endOfDay(now) };
      default:
        return { start: startOfMonth(now), end: endOfDay(now) };
    }
  }, [statPeriod]);

  const { data: stats } = useAdminReportStats({
    startDate: statDateRange.start,
    endDate: statDateRange.end,
  });

  const { data: orders } = useGenerateAdminOrdersReports({
    startDate: ordersStartDate,
    endDate: ordersEndDate,
  });

  const { data: financialReport } = useGenerateAdminFinancialReports({
    startDate: financialStartDate,
    endDate: financialEndDate,
  });

  const { data: paymentsReport } = useGenerateAdminPaymentsReport({
    startDate: financialStartDate,
    endDate: financialEndDate,
  });

  const handleDownloadOrdersXls = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const filename = `admin-orders-report-${today}.csv`;
    downloadAdminOrdersReportCsv(orders, filename);
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const pdfFilename = `admin-orders-report-${today}.pdf`;
  const financialCsvFilename = `admin-financial-report-${today}.csv`;
  const financialPdfFilename = `admin-financial-report-${today}.pdf`;

  return (
    <div className="p-6 space-y-6">
      <StatSection period={statPeriod} onChangePeriod={setStatPeriod} stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportCard
          title="Orders Report"
          description="Generate a comprehensive report of all completed orders across all vendors for the duration you select in PDF or CSV format."
          startDate={ordersStartDate}
          endDate={ordersEndDate}
          onChangeStartDate={setOrdersStartDate}
          onChangeEndDate={setOrdersEndDate}
          onDownloadXls={handleDownloadOrdersXls}
          disableDownload={!orders || orders.length === 0}
          pdfDownloadButton={
            orders && orders.length > 0 ? (
              <AdminOrdersPDFDownloadButton
                orders={orders}
                startDate={ordersStartDate}
                endDate={ordersEndDate}
                filename={pdfFilename}
                className="h-11 w-full inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium text-sm px-4 py-2"
              >
                Download PDF
              </AdminOrdersPDFDownloadButton>
            ) : (
              <Button variant="secondary" className="h-11" disabled>
                Download PDF
              </Button>
            )
          }
        />
        <ReportCard
          title="Financial Report"
          description="Generate a comprehensive financial report (completed + paid orders) across all vendors with customer details for the duration you select."
          startDate={financialStartDate}
          endDate={financialEndDate}
          onChangeStartDate={setFinancialStartDate}
          onChangeEndDate={setFinancialEndDate}
          pdfDownloadButton={
            (paymentsReport && paymentsReport.length > 0) || financialReport ? (
              <AdminFinancialPDFDownloadButton
                summary={financialReport}
                payments={paymentsReport}
                startDate={financialStartDate}
                endDate={financialEndDate}
                filename={financialPdfFilename}
                className="h-11 w-full inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium text-sm px-4 py-2"
              >
                Download PDF
              </AdminFinancialPDFDownloadButton>
            ) : (
              <Button variant="secondary" className="h-11" disabled>
                Download PDF
              </Button>
            )
          }
          onDownloadXls={() => {
            downloadAdminFinancialReportCsv(
              financialReport,
              paymentsReport,
              financialCsvFilename
            );
          }}
          disableDownload={
            (!paymentsReport || paymentsReport.length === 0) && !financialReport
          }
        />
      </div>
    </div>
  );
};

