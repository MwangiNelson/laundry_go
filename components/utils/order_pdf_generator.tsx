import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import type { OrdersReportRow } from "./exel_orders_generator";

type OrderItem = {
  name: string;
  quantity: number;
  services?: string[];
  total_price: number;
  price_per_unit: number;
};

type LocationDetails = {
  type?: string;
  location?: string;
  service_category?: string;
  cleaning_type?: string;
  destination?: string;
  source_floor?: string;
  destination_floor?: string;
};

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 32,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  header: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748b",
  },
  reportInfo: {
    fontSize: 9,
    color: "#94a3b8",
    textAlign: "right",
  },
  dividerAccent: {
    height: 3,
    backgroundColor: "#2563eb",
    width: 60,
    marginBottom: 20,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderLeft: "3 solid #2563eb",
  },
  statCardPurple: {
    borderLeft: "3 solid #7c3aed",
  },
  statCardGreen: {
    borderLeft: "3 solid #10b981",
  },
  statCardOrange: {
    borderLeft: "3 solid #f59e0b",
  },
  statLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  table: {
    width: "100%",
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
    border: "1 solid #e2e8f0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    padding: 10,
  },
  tableHeaderText: {
    fontSize: 8,
    color: "#ffffff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #f1f5f9",
    padding: 10,
    minHeight: 40,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  tableCell: {
    fontSize: 9,
    color: "#334155",
    paddingRight: 4,
  },
  tableCellBold: {
    fontWeight: "bold",
    color: "#0f172a",
  },
  tableCellSmall: {
    fontSize: 8,
    color: "#94a3b8",
  },
  // Column widths - adjusted for better spacing
  col1: { width: "10%" },
  col2: { width: "12%" },
  col3: { width: "12%" },
  col4: { width: "16%" },
  col5: { width: "10%" },
  col6: { width: "16%" },
  col7: { width: "10%" },
  col8: { width: "14%" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1 solid #e2e8f0",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  footerBrand: {
    fontSize: 8,
    color: "#2563eb",
    fontWeight: "bold",
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusDefault: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusProcessing: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusCompleted: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  paymentPaid: {
    color: "#059669",
    fontWeight: "bold",
  },
  paymentPending: {
    color: "#d97706",
  },
});

// Helper functions
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const formatItems = (items: unknown): string => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return "-";
  }

  return items
    .map((item: OrderItem) => {
      return `${item.quantity}x ${item.name}`;
    })
    .join(", ");
};

const getPickupLocation = (details: unknown): string => {
  if (!details || typeof details !== "object") return "-";
  const d = details as LocationDetails;
  if (d.location) {
    // Truncate long locations
    return d.location.length > 25
      ? d.location.substring(0, 22) + "..."
      : d.location;
  }
  return "-";
};

const formatStatus = (status: string | null): string => {
  if (!status) return "-";
  // Convert snake_case to Title Case
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getStatusStyle = (status: string | null) => {
  const baseStyle = styles.statusBadge;
  if (!status) return [baseStyle, styles.statusDefault];

  const statusLower = status.toLowerCase();
  if (statusLower.includes("complete") || statusLower === "complete") {
    return [baseStyle, styles.statusCompleted];
  }
  if (statusLower.includes("cancel") || statusLower.includes("reject")) {
    return [baseStyle, styles.statusCancelled];
  }
  if (
    statusLower.includes("pending") ||
    statusLower.includes("under_review") ||
    statusLower.includes("review")
  ) {
    return [baseStyle, styles.statusPending];
  }
  if (
    statusLower.includes("process") ||
    statusLower.includes("pickup") ||
    statusLower.includes("delivery") ||
    statusLower.includes("accepted")
  ) {
    return [baseStyle, styles.statusProcessing];
  }
  return [baseStyle, styles.statusDefault];
};

const formatPaymentStatus = (status: string | null): string => {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Calculate statistics
const calculateStats = (orders: OrdersReportRow[]) => {
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "complete"
  ).length;
  const paidOrders = orders.filter(
    (o) => o.payment_status?.toLowerCase() === "paid"
  ).length;
  const totalRevenue = orders
    .filter((o) => o.payment_status?.toLowerCase() === "paid")
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  return {
    totalOrders,
    completedOrders,
    paidOrders,
    totalRevenue,
  };
};

interface OrdersReportDocumentProps {
  orders: OrdersReportRow[];
  vendorName?: string;
  startDate?: Date;
  endDate?: Date;
}

// PDF Document Component
const OrdersReportDocument: React.FC<OrdersReportDocumentProps> = ({
  orders,
  vendorName,
  startDate,
  endDate,
}) => {
  const stats = calculateStats(orders);
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateRangeText =
    startDate && endDate
      ? `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : "All Time";

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>LaundryGo</Text>
            <Text style={styles.title}>Orders Report</Text>
            <Text style={styles.subtitle}>{vendorName || "Vendor Report"}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportInfo}>Report Period</Text>
            <Text style={[styles.subtitle, { marginBottom: 8 }]}>
              {dateRangeText}
            </Text>
            <Text style={styles.reportInfo}>Generated: {generatedDate}</Text>
          </View>
        </View>

        <View style={styles.dividerAccent} />

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{stats.completedOrders}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={styles.statLabel}>Paid Orders</Text>
            <Text style={styles.statValue}>{stats.paidOrders}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>
              {formatCurrency(stats.totalRevenue)}
            </Text>
          </View>
        </View>

        {/* Orders Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>Date</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>
                Order ID
              </Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>Status</Text>
              <Text style={[styles.tableHeaderText, styles.col4]}>Items</Text>
              <Text style={[styles.tableHeaderText, styles.col5]}>Amount</Text>
              <Text style={[styles.tableHeaderText, styles.col6]}>
                Customer
              </Text>
              <Text style={[styles.tableHeaderText, styles.col7]}>Payment</Text>
              <Text style={[styles.tableHeaderText, styles.col8]}>
                Location
              </Text>
            </View>

            {/* Table Rows */}
            {orders.map((order, index) => {
              const rowStyle =
                index % 2 === 1
                  ? [styles.tableRow, styles.tableRowAlt]
                  : styles.tableRow;
              const isPaid = order.payment_status?.toLowerCase() === "paid";

              return (
                <View key={order.order_id} style={rowStyle} wrap={false}>
                  <View style={styles.col1}>
                    <Text style={styles.tableCell}>
                      {formatDate(order.created_at)}
                    </Text>
                  </View>
                  <View style={styles.col2}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      #{order.order_id.slice(0, 8)}
                    </Text>
                  </View>
                  <View style={styles.col3}>
                    <Text style={getStatusStyle(order.status)}>
                      {formatStatus(order.status)}
                    </Text>
                  </View>
                  <View style={styles.col4}>
                    <Text style={styles.tableCell}>
                      {formatItems(order.items)}
                    </Text>
                  </View>
                  <View style={styles.col5}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      {formatCurrency(order.total_price)}
                    </Text>
                  </View>
                  <View style={styles.col6}>
                    <Text style={styles.tableCell}>
                      {order.customer_name || "-"}
                    </Text>
                    <Text style={styles.tableCellSmall}>
                      {order.customer_phone || ""}
                    </Text>
                  </View>
                  <View style={styles.col7}>
                    <Text style={styles.tableCell}>
                      {order.payment_method || "-"}
                    </Text>
                    <Text
                      style={[
                        styles.tableCellSmall,
                        isPaid ? styles.paymentPaid : styles.paymentPending,
                      ]}
                    >
                      {formatPaymentStatus(order.payment_status)}
                    </Text>
                  </View>
                  <View style={styles.col8}>
                    <Text style={styles.tableCell}>
                      {getPickupLocation(order.pickup_details)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerBrand}>LaundryGo</Text>
          <Text
            style={styles.footerText}
            render={({
              pageNumber,
              totalPages,
            }: {
              pageNumber: number;
              totalPages: number;
            }) => `Page ${pageNumber} of ${totalPages}`}
          />
          <Text style={styles.footerText}>Confidential</Text>
        </View>
      </Page>
    </Document>
  );
};

// Export function to download PDF
export const downloadOrdersReportPdf = async (
  orders: OrdersReportRow[] | null | undefined,
  vendorName?: string,
  startDate?: Date,
  endDate?: Date,
  filename = "orders-report.pdf"
) => {
  if (!orders || orders.length === 0) {
    throw new Error("No orders to generate report");
  }

  // This function is meant to be used with pdf() from @react-pdf/renderer
  // However, since we're in a client component, we'll use the PDFDownloadLink instead
  // See the component below
  return {
    orders,
    vendorName,
    startDate,
    endDate,
    filename,
  };
};

// Component for PDF Download Link (to be used in React components)
interface PDFDownloadButtonProps {
  orders: OrdersReportRow[];
  vendorName?: string;
  startDate?: Date;
  endDate?: Date;
  filename?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  orders,
  vendorName,
  startDate,
  endDate,
  filename = "orders-report.pdf",
  children,
  className,
}) => {
  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <PDFDownloadLink
      document={
        <OrdersReportDocument
          orders={orders}
          vendorName={vendorName}
          startDate={startDate}
          endDate={endDate}
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

export default OrdersReportDocument;
