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

// Register fonts if needed (optional - for better typography)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

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
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12, // base font size for the whole document
  },
  header: {
    marginBottom: 30,
    borderBottom: "2 solid #2563eb",
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 3,
  },
  reportInfo: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
    border: "1 solid #e2e8f0",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },
  table: {
    width: "100%",
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontWeight: "bold",
  },
  tableHeaderText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e2e8f0",
    padding: 12,
    minHeight: 45,
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 11,
    color: "#334155",
    paddingRight: 5,
  },
  tableCellBold: {
    fontWeight: "bold",
  },
  // Column widths
  col1: { width: "8%" },
  col2: { width: "12%" },
  col3: { width: "10%" },
  col4: { width: "15%" },
  col5: { width: "10%" },
  col6: { width: "15%" },
  col7: { width: "12%" },
  col8: { width: "18%" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#94a3b8",
    borderTop: "1 solid #e2e8f0",
    paddingTop: 10,
  },
  orderDetails: {
    backgroundColor: "#fefce8",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    border: "1 solid #fde047",
  },
  orderDetailsText: {
    fontSize: 12,
    color: "#713f12",
    marginBottom: 3,
  },
  statusBadge: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "3 8",
    borderRadius: 3,
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusCompleted: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
});

// Helper functions
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const formatCurrency = (amount: number): string => {
  return `KES ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatItems = (items: unknown): string => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return "No items";
  }

  return items
    .map((item: OrderItem) => {
      const services =
        item.services && item.services.length > 0
          ? ` (${item.services.join(", ")})`
          : "";
      return `${item.quantity}x ${item.name}${services}`;
    })
    .join(", ");
};

const getItemCount = (items: unknown): number => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
};

const getPickupLocation = (details: unknown): string => {
  if (!details || typeof details !== "object") return "N/A";
  const d = details as LocationDetails;
  return d.location || "N/A";
};

const getStatusStyle = (status: string | null) => {
  const baseStyle = styles.statusBadge;
  if (!status) return baseStyle;

  const statusLower = status.toLowerCase();
  if (statusLower.includes("complete") || statusLower.includes("delivered")) {
    return [baseStyle, styles.statusCompleted];
  }
  if (statusLower.includes("cancel") || statusLower.includes("reject")) {
    return [baseStyle, styles.statusCancelled];
  }
  if (statusLower.includes("pending") || statusLower.includes("processing")) {
    return [baseStyle, styles.statusPending];
  }
  return baseStyle;
};

// Calculate statistics
const calculateStats = (orders: OrdersReportRow[]) => {
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) => o.status?.toLowerCase().includes("complete") || 
           o.status?.toLowerCase().includes("delivered")
  ).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalItems = orders.reduce(
    (sum, o) => sum + getItemCount(o.items),
    0
  );

  return {
    totalOrders,
    completedOrders,
    totalRevenue,
    totalItems,
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
          <Text style={styles.title}>Orders Report</Text>
          <Text style={styles.subtitle}>
            {vendorName || "LaundryGo Vendor"}
          </Text>
          <Text style={styles.reportInfo}>
            Report Period: {dateRangeText} | Generated: {generatedDate}
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{stats.completedOrders}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statValue}>{stats.totalItems}</Text>
          </View>
          <View style={styles.statCard}>
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

              return (
              <View
                key={order.order_id}
                style={rowStyle}
              >
                <Text style={[styles.tableCell, styles.col1]}>
                  {formatDate(order.created_at).split(",")[0]}
                </Text>
                <Text style={[styles.tableCell, styles.col2, styles.tableCellBold]}>
                  #{order.order_id.slice(0, 8)}
                </Text>
                <View style={styles.col3}>
                  <Text style={getStatusStyle(order.status)}>
                    {order.status || "N/A"}
                  </Text>
                </View>
                <Text style={[styles.tableCell, styles.col4]}>
                  {formatItems(order.items)}
                </Text>
                <Text
                  style={[styles.tableCell, styles.col5, styles.tableCellBold]}
                >
                  {formatCurrency(order.total_price)}
                </Text>
                <Text style={[styles.tableCell, styles.col6]}>
                  {order.customer_name || "N/A"}
                  {"\n"}
                  <Text style={{ fontSize: 9, color: "#64748b" }}>
                    {order.customer_phone || ""}
                  </Text>
                </Text>
                <Text style={[styles.tableCell, styles.col7]}>
                  {order.payment_method || "N/A"}
                  {"\n"}
                  <Text style={{ fontSize: 9, color: "#64748b" }}>
                    {order.payment_status || ""}
                  </Text>
                </Text>
                <Text style={[styles.tableCell, styles.col8]}>
                  {getPickupLocation(order.pickup_details)}
                </Text>
              </View>
            )})}
          </View>
        </View>

        {/* Footer */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `Page ${pageNumber} of ${totalPages} | LaundryGo Orders Report | Confidential`
          }
          fixed
        />
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

