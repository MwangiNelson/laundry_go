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
  useGenerateFinancialReports,
  useGenerateOrdersReports,
  useGeneratePaymentsReport,
  useVendorReportStats,
} from "@/api/vendor/reports/use_reports";
import {
  downloadNominalFinancialReportCsv,
  downloadOrdersReportCsv,
} from "@/components/utils/exel_orders_generator";
import { PDFDownloadButton } from "@/components/utils/order_pdf_generator";
import { useVendor } from "@/components/context/vendors/vendor_provider";
import { VendorFinancialPDFDownloadButton } from "@/components/utils/vendor_financial_report";

type StatPeriod = "month" | "quarter" | "year";

const StatSection = ({
  period,
  onChangePeriod,
  stats,
}: {
  period: StatPeriod;
  onChangePeriod: (p: StatPeriod) => void;
  stats: Awaited<ReturnType<typeof useVendorReportStats>>["data"];
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

export const ReportsPageUI = () => {
  const [statPeriod, setStatPeriod] = React.useState<StatPeriod>("month");
  const [ordersStartDate, setOrdersStartDate] = React.useState<
    Date | undefined
    
  >();
  const [ordersEndDate, setOrdersEndDate] = React.useState<Date | undefined>();
  const [financialStartDate, setFinancialStartDate] = React.useState<
    Date | undefined
  >();
  const [financialEndDate, setFinancialEndDate] =
    React.useState<Date | undefined>();

  const { vendor } = useVendor();

  const statStartDate = React.useMemo(() => {
    const now = new Date();
    if (statPeriod === "month") return startOfMonth(now);
    if (statPeriod === "quarter") return startOfQuarter(now);
    return startOfYear(now);
  }, [statPeriod]);
  const statEndDate = React.useMemo(() => endOfDay(new Date()), []);

  const { data: stats } = useVendorReportStats({
    vendorId: vendor?.id,
    startDate: statStartDate,
    endDate: statEndDate,
  });
  const { data: orders } = useGenerateOrdersReports({
    startDate: ordersStartDate,
    endDate: ordersEndDate,
  });
  const { data: financialReport } = useGenerateFinancialReports({
    vendorId: vendor?.id,
    startDate: financialStartDate,
    endDate: financialEndDate,
  });
  const { data: paymentsReport } = useGeneratePaymentsReport({
    vendorId: vendor?.id,
    startDate: financialStartDate,
    endDate: financialEndDate,
  });

  const handleDownloadOrdersXls = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const filename = `orders-report-${today}.csv`;
    downloadOrdersReportCsv(orders, filename);
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const pdfFilename = `orders-report-${today}.pdf`;
  const financialCsvFilename = `financial-report-${today}.csv`;
  const financialPdfFilename = `financial-report-${today}.pdf`;

  return (
    <div className="p-6 space-y-6">
      <StatSection
        period={statPeriod}
        onChangePeriod={setStatPeriod}
        stats={stats}
      />

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
          pdfDownloadButton={
            orders && orders.length > 0 ? (
              <PDFDownloadButton
                orders={orders}
                vendorName={vendor?.business_name || undefined}
                startDate={ordersStartDate}
                endDate={ordersEndDate}
                filename={pdfFilename}
                className="h-11 w-full inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium text-sm px-4 py-2"
              >
                Download PDF
              </PDFDownloadButton>
            ) : (
              <Button
                variant="secondary"
                className="h-11"
                disabled
              >
                Download PDF
              </Button>
            )
          }
        />
        <ReportCard
          title="Financial Report"
          description="Generate a nominal payments report (customer-by-customer) for the duration you select, plus a summary totals CSV."
          startDate={financialStartDate}
          endDate={financialEndDate}
          onChangeStartDate={setFinancialStartDate}
          onChangeEndDate={setFinancialEndDate}
          pdfDownloadButton={
            (paymentsReport && paymentsReport.length > 0) || financialReport ? (
              <VendorFinancialPDFDownloadButton
                vendorName={vendor?.business_name || undefined}
                startDate={financialStartDate}
                endDate={financialEndDate}
                summary={financialReport}
                payments={paymentsReport}
                filename={financialPdfFilename}
                className="h-11 w-full inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium text-sm px-4 py-2"
              >
                Download PDF
              </VendorFinancialPDFDownloadButton>
            ) : (
              <Button variant="secondary" className="h-11" disabled>
                Download PDF
              </Button>
            )
          }
          onDownloadXls={() => {
            // Single CSV: summary (if present) + customer-by-customer payments (if present)
            downloadNominalFinancialReportCsv(
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
