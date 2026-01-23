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
  AdminFinancialReportRow,
  AdminPaymentRow,
} from "@/api/admin/reports/use_reports.admin";

const styles = StyleSheet.create({
  page: { backgroundColor: "#ffffff", padding: 40, fontFamily: "Helvetica", fontSize: 12 },
  header: { marginBottom: 30, borderBottom: "2 solid #2563eb", paddingBottom: 15 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b", marginBottom: 5 },
  subtitle: { fontSize: 12, color: "#64748b", marginBottom: 3 },
  reportInfo: { fontSize: 10, color: "#64748b", marginTop: 10 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b", marginBottom: 15, backgroundColor: "#f1f5f9", padding: 8 },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, gap: 10 },
  statCard: { flex: 1, backgroundColor: "#f8fafc", padding: 12, borderRadius: 6, border: "1 solid #e2e8f0" },
  statLabel: { fontSize: 11, color: "#64748b", marginBottom: 4, textTransform: "uppercase" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#2563eb" },
  table: { width: "100%", marginTop: 15 },
  tableHeader: { flexDirection: "row", backgroundColor: "#2563eb", padding: 10 },
  tableHeaderText: { fontSize: 10, color: "#ffffff", fontWeight: "bold", textTransform: "uppercase" },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #e2e8f0", padding: 10, minHeight: 40 },
  tableRowAlt: { backgroundColor: "#f8fafc" },
  tableCell: { fontSize: 10, color: "#334155", paddingRight: 5 },
  col1: { width: "12%" }, // Date
  col2: { width: "15%" }, // Vendor
  col3: { width: "12%" }, // Amount
  col4: { width: "20%" }, // Customer
  col5: { width: "18%" }, // Payment
  col6: { width: "23%" }, // Reference
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 10, color: "#94a3b8", borderTop: "1 solid #e2e8f0", paddingTop: 10 },
});

const formatCurrency = (amount: number) => `KES ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

interface AdminFinancialReportDocumentProps {
  summary?: AdminFinancialReportRow | null;
  payments?: AdminPaymentRow[] | null;
  startDate?: Date;
  endDate?: Date;
}

const AdminFinancialReportDocument: React.FC<AdminFinancialReportDocumentProps> = ({ summary, payments, startDate, endDate }) => {
  const dateRangeText = startDate && endDate
    ? `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "All Time";

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.title}>Admin Financial Report</Text>
          <Text style={styles.subtitle}>LaundryGo - All Vendors</Text>
          <Text style={styles.reportInfo}>Report Period: {dateRangeText} | Generated: {new Date().toLocaleDateString("en-US")}</Text>
        </View>

        {summary && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Orders</Text>
              <Text style={styles.statValue}>{summary.total_completed_paid_orders}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Revenue</Text>
              <Text style={styles.statValue}>{formatCurrency(summary.total_revenue)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg Order Value</Text>
              <Text style={styles.statValue}>{formatCurrency(summary.average_order_value)}</Text>
            </View>
          </View>
        )}

        {payments && payments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payments</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.col1]}>Paid At</Text>
                <Text style={[styles.tableHeaderText, styles.col2]}>Vendor</Text>
                <Text style={[styles.tableHeaderText, styles.col3]}>Amount</Text>
                <Text style={[styles.tableHeaderText, styles.col4]}>Customer</Text>
                <Text style={[styles.tableHeaderText, styles.col5]}>Payment Method</Text>
                <Text style={[styles.tableHeaderText, styles.col6]}>Reference</Text>
              </View>

              {payments.map((payment, index) => {
                const rowStyle = index % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow;
                return (
                <View key={payment.order_id} style={rowStyle}>
                  <Text style={[styles.tableCell, styles.col1]}>{formatDate(payment.paid_at)}</Text>
                  <Text style={[styles.tableCell, styles.col2]}>{payment.vendor_name || "N/A"}</Text>
                  <Text style={[styles.tableCell, styles.col3]}>{formatCurrency(payment.amount)}</Text>
                  <Text style={[styles.tableCell, styles.col4]}>
                    {payment.customer_name || "N/A"}
                    {"\n"}
                    <Text style={{ fontSize: 9, color: "#64748b" }}>{payment.customer_phone || ""}</Text>
                  </Text>
                  <Text style={[styles.tableCell, styles.col5]}>
                    {payment.payment_method || "N/A"}
                    {"\n"}
                    <Text style={{ fontSize: 9, color: "#64748b" }}>{payment.payment_channel || ""}</Text>
                  </Text>
                  <Text style={[styles.tableCell, styles.col6]}>{payment.payment_reference || "N/A"}</Text>
                </View>
              );
              })}
            </View>
          </View>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} of ${totalPages} | LaundryGo Admin Financial Report | Confidential`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

interface AdminFinancialPDFDownloadButtonProps {
  summary?: AdminFinancialReportRow | null;
  payments?: AdminPaymentRow[] | null;
  startDate?: Date;
  endDate?: Date;
  filename?: string;
  children?: React.ReactNode;
  className?: string;
}

export const AdminFinancialPDFDownloadButton: React.FC<AdminFinancialPDFDownloadButtonProps> = ({
  summary,
  payments,
  startDate,
  endDate,
  filename = "admin-financial-report.pdf",
  children,
  className,
}) => {
  if ((!payments || payments.length === 0) && !summary) return null;

  return (
    <PDFDownloadLink
      document={<AdminFinancialReportDocument summary={summary} payments={payments} startDate={startDate} endDate={endDate} />}
      fileName={filename}
      className={className}
    >
      {({ loading }: { loading: boolean }) => (loading ? "Generating PDF..." : children || "Download PDF")}
    </PDFDownloadLink>
  );
};

