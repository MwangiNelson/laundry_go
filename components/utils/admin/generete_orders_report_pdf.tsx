import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import type { Database } from "@/database.types";

type AdminOrdersReportRow =
  Database["public"]["Functions"]["get_admin_orders_report"]["Returns"][number];

// Styles similar to vendor report but adapted for admin
const styles = StyleSheet.create({
  page: { backgroundColor: "#ffffff", padding: 40, fontFamily: "Helvetica", fontSize: 12 },
  header: { marginBottom: 30, borderBottom: "2 solid #2563eb", paddingBottom: 15 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b", marginBottom: 5 },
  subtitle: { fontSize: 12, color: "#64748b", marginBottom: 3 },
  reportInfo: { fontSize: 10, color: "#64748b", marginTop: 10 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1e293b", marginBottom: 15, backgroundColor: "#f1f5f9", padding: 8, borderRadius: 4 },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, gap: 10 },
  statCard: { flex: 1, backgroundColor: "#f8fafc", padding: 12, borderRadius: 6, border: "1 solid #e2e8f0" },
  statLabel: { fontSize: 12, color: "#64748b", marginBottom: 4, textTransform: "uppercase" },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#2563eb" },
  table: { width: "100%", marginTop: 15 },
  tableHeader: { flexDirection: "row", backgroundColor: "#2563eb", padding: 10, borderTopLeftRadius: 4, borderTopRightRadius: 4, fontWeight: "bold" },
  tableHeaderText: { fontSize: 11, color: "#ffffff", fontWeight: "bold", textTransform: "uppercase" },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #e2e8f0", padding: 10, minHeight: 40 },
  tableRowAlt: { backgroundColor: "#f8fafc" },
  tableCell: { fontSize: 10, color: "#334155", paddingRight: 5 },
  tableCellBold: { fontWeight: "bold" },
  col1: { width: "10%" }, // Date
  col2: { width: "15%" }, // Vendor
  col3: { width: "15%" }, // Items
  col4: { width: "12%" }, // Amount
  col5: { width: "15%" }, // Customer
  col6: { width: "15%" }, // Payment
  col7: { width: "18%" }, // Location
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 10, color: "#94a3b8", borderTop: "1 solid #e2e8f0", paddingTop: 10 },
  statusBadge: { backgroundColor: "#d1fae5", color: "#065f46", padding: "3 8", borderRadius: 3, fontSize: 10, fontWeight: "bold" },
});

const formatCurrency = (amount: number) => `KES ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

interface AdminOrdersReportDocumentProps {
  orders: AdminOrdersReportRow[];
  startDate?: Date;
  endDate?: Date;
}

const AdminOrdersReportDocument: React.FC<AdminOrdersReportDocumentProps> = ({ orders, startDate, endDate }) => {
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0),
  };

  const dateRangeText = startDate && endDate
    ? `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "All Time";

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.title}>Admin Orders Report</Text>
          <Text style={styles.subtitle}>LaundryGo - All Vendors (Completed Orders)</Text>
          <Text style={styles.reportInfo}>Report Period: {dateRangeText} | Generated: {new Date().toLocaleDateString("en-US")}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>Date</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>Vendor</Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>Items</Text>
              <Text style={[styles.tableHeaderText, styles.col4]}>Amount</Text>
              <Text style={[styles.tableHeaderText, styles.col5]}>Customer</Text>
              <Text style={[styles.tableHeaderText, styles.col6]}>Payment</Text>
              <Text style={[styles.tableHeaderText, styles.col7]}>Location</Text>
            </View>

            {orders.map((order, index) => {
              type OrderItem = { quantity?: number; [key: string]: unknown };
              const items = Array.isArray(order.items) && order.items.length > 0
                ? `${order.items.reduce((sum: number, item: OrderItem) => sum + (item.quantity || 0), 0)} items`
                : "No items";
              type PickupDetails = { location?: string; [key: string]: unknown };
              const location = typeof order.pickup_details === "object" && order.pickup_details !== null
                ? (order.pickup_details as PickupDetails).location || "N/A"
                : "N/A";

              const rowStyle = index % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow;
              return (
                <View key={order.order_id} style={rowStyle}>
                  <Text style={[styles.tableCell, styles.col1]}>{formatDate(order.created_at)}</Text>
                  <Text style={[styles.tableCell, styles.col2, styles.tableCellBold]}>{order.vendor_name || "N/A"}</Text>
                  <Text style={[styles.tableCell, styles.col3]}>{items}</Text>
                  <Text style={[styles.tableCell, styles.col4, styles.tableCellBold]}>{formatCurrency(order.total_price)}</Text>
                  <Text style={[styles.tableCell, styles.col5]}>
                    {order.customer_name || "N/A"}
                    {"\n"}
                    <Text style={{ fontSize: 9, color: "#64748b" }}>{order.customer_phone || ""}</Text>
                  </Text>
                  <Text style={[styles.tableCell, styles.col6]}>
                    {order.payment_method || "N/A"}
                    {"\n"}
                    <Text style={{ fontSize: 9, color: "#64748b" }}>{order.payment_status || ""}</Text>
                  </Text>
                  <Text style={[styles.tableCell, styles.col7]}>{location}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} of ${totalPages} | LaundryGo Admin Orders Report | Confidential`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

interface AdminOrdersPDFDownloadButtonProps {
  orders: AdminOrdersReportRow[];
  startDate?: Date;
  endDate?: Date;
  filename?: string;
  children?: React.ReactNode;
  className?: string;
}

export const AdminOrdersPDFDownloadButton: React.FC<AdminOrdersPDFDownloadButtonProps> = ({
  orders,
  startDate,
  endDate,
  filename = "admin-orders-report.pdf",
  children,
  className,
}) => {
  if (!orders || orders.length === 0) return null;

  return (
    <PDFDownloadLink
      document={<AdminOrdersReportDocument orders={orders} startDate={startDate} endDate={endDate} />}
      fileName={filename}
      className={className}
    >
      {({ loading }: { loading: boolean }) => (loading ? "Generating PDF..." : children || "Download PDF")}
    </PDFDownloadLink>
  );
};

