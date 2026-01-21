import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

import type {
  FinancialReportRow,
  VendorPaymentRow,
} from "@/components/utils/exel_orders_generator";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  header: {
    marginBottom: 18,
    borderBottom: "2 solid #2563eb",
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 2,
  },
  reportInfo: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
    border: "1 solid #e2e8f0",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e2e8f0",
    padding: 12,
    minHeight: 42,
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  cell: {
    fontSize: 11,
    color: "#334155",
    paddingRight: 6,
  },
  cellMuted: {
    fontSize: 9,
    color: "#64748b",
  },
  cellBold: {
    fontWeight: "bold",
  },
  // column widths (landscape)
  c1: { width: "12%" }, // paid at
  c2: { width: "14%" }, // order id
  c3: { width: "12%" }, // amount
  c4: { width: "12%" }, // status
  c5: { width: "22%" }, // customer
  c6: { width: "14%" }, // method/channel
  c7: { width: "14%" }, // reference
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#94a3b8",
    borderTop: "1 solid #e2e8f0",
    paddingTop: 10,
  },
});

const formatCurrency = (amount: number | null | undefined) => {
  const n = typeof amount === "number" ? amount : Number(amount ?? 0);
  return `KES ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatShortDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const shortId = (id: string) => (id ? `#${id.slice(0, 8)}` : "N/A");

export interface VendorFinancialReportDocumentProps {
  vendorName?: string;
  startDate?: Date;
  endDate?: Date;
  summary?: FinancialReportRow | null;
  payments?: VendorPaymentRow[] | null;
}

export const VendorFinancialReportDocument: React.FC<
  VendorFinancialReportDocumentProps
> = ({ vendorName, startDate, endDate, summary, payments }) => {
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dateRangeText =
    startDate && endDate
      ? `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : "All Time";

  const totalPaidOrders = summary?.total_paid_orders ?? payments?.length ?? 0;
  const totalRevenue = summary?.total_revenue ?? 0;
  const avgOrder = summary?.average_order_value ?? 0;

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.title}>Financial Report</Text>
          <Text style={styles.subtitle}>{vendorName || "LaundryGo Vendor"}</Text>
          <Text style={styles.reportInfo}>
            Report Period: {dateRangeText} | Generated: {generatedDate}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Paid Orders</Text>
            <Text style={styles.statValue}>{totalPaidOrders}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>{formatCurrency(totalRevenue)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Order Value</Text>
            <Text style={styles.statValue}>{formatCurrency(avgOrder)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Min / Max</Text>
            <Text style={styles.statValue}>
              {formatCurrency(summary?.min_order_value ?? 0)} /{" "}
              {formatCurrency(summary?.max_order_value ?? 0)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payments (Nominal)</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.c1]}>Paid At</Text>
            <Text style={[styles.tableHeaderText, styles.c2]}>Order</Text>
            <Text style={[styles.tableHeaderText, styles.c3]}>Amount</Text>
            <Text style={[styles.tableHeaderText, styles.c4]}>Status</Text>
            <Text style={[styles.tableHeaderText, styles.c5]}>Customer</Text>
            <Text style={[styles.tableHeaderText, styles.c6]}>Payment</Text>
            <Text style={[styles.tableHeaderText, styles.c7]}>Reference</Text>
          </View>

          {(payments ?? []).map((p, idx) => {
            const rowStyle =
              idx % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow;

            return (
              <View key={`${p.order_id}-${idx}`} style={rowStyle}>
                <Text style={[styles.cell, styles.c1]}>
                  {formatShortDate(p.paid_at)}
                </Text>
                <Text style={[styles.cell, styles.c2, styles.cellBold]}>
                  {shortId(p.order_id)}
                </Text>
                <Text style={[styles.cell, styles.c3, styles.cellBold]}>
                  {formatCurrency(p.amount)}
                </Text>
                <Text style={[styles.cell, styles.c4]}>{p.order_status || "N/A"}</Text>
                <Text style={[styles.cell, styles.c5]}>
                  {p.customer_name || "N/A"}
                  {"\n"}
                  <Text style={styles.cellMuted}>{p.customer_phone || ""}</Text>
                </Text>
                <Text style={[styles.cell, styles.c6]}>
                  {p.payment_method || "N/A"}
                  {"\n"}
                  <Text style={styles.cellMuted}>{p.payment_channel || ""}</Text>
                </Text>
                <Text style={[styles.cell, styles.c7]}>
                  {p.payment_reference || "N/A"}
                </Text>
              </View>
            );
          })}
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} of ${totalPages} | LaundryGo Financial Report | Confidential`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export interface VendorFinancialPDFDownloadButtonProps {
  vendorName?: string;
  startDate?: Date;
  endDate?: Date;
  summary?: FinancialReportRow | null;
  payments?: VendorPaymentRow[] | null;
  filename?: string;
  children?: React.ReactNode;
  className?: string;
}

export const VendorFinancialPDFDownloadButton: React.FC<
  VendorFinancialPDFDownloadButtonProps
> = ({
  vendorName,
  startDate,
  endDate,
  summary,
  payments,
  filename = "financial-report.pdf",
  children,
  className,
}) => {
  const hasData = !!summary || ((payments?.length ?? 0) > 0);
  if (!hasData) return null;

  return (
    <PDFDownloadLink
      document={
        <VendorFinancialReportDocument
          vendorName={vendorName}
          startDate={startDate}
          endDate={endDate}
          summary={summary}
          payments={payments}
        />
      }
      fileName={filename}
      className={className}
    >
      {({ loading }: { loading: boolean }) =>
        loading ? "Generating PDF..." : children || "Download PDF"
      }
    </PDFDownloadLink>
  );
};

