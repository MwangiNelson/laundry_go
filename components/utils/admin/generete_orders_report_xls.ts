import type { Database } from "@/database.types";

type AdminOrdersReportRow =
  Database["public"]["Functions"]["get_admin_orders_report"]["Returns"][number];

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

// Helper to format items into a readable string
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
      return `${item.quantity}x ${item.name}${services} @ ${item.price_per_unit} KES`;
    })
    .join("; ");
};

// Helper to get item count
const getItemCount = (items: unknown): number => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
};

// Helper to format pickup location
const formatPickupLocation = (details: unknown): string => {
  if (!details || typeof details !== "object") return "";
  const d = details as LocationDetails;
  return d.location || "";
};

// Helper to format delivery location
const formatDeliveryLocation = (details: unknown): string => {
  if (!details || typeof details !== "object") return "";
  const d = details as LocationDetails;
  return d.location || d.destination || "";
};

// Helper to format date
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
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

// Helper to format service category
const formatServiceCategory = (details: unknown): string => {
  if (!details || typeof details !== "object") return "N/A";
  const d = details as LocationDetails;
  return d.service_category || "N/A";
};

export const downloadAdminOrdersReportCsv = (
  rows: AdminOrdersReportRow[] | null | undefined,
  filename = "admin-orders-report.csv"
) => {
  if (!rows || rows.length === 0) return;

  const headers = [
    "Order Id",
    "Date Created",
    "Status",
    "Vendor Name",
    "Service Type",
    "Service Category",
    "Items Summary",
    "Total Items",
    "Total Amount (KES)",
    "Payment Method",
    "Payment Status",
    "Customer Name",
    "Customer Phone",
    "Rider Name",
    "Pickup Location",
    "Delivery Location",
  ];

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value.toString();
    const str = String(value);
    const needsWrap = /[",\n]/.test(str);
    const escaped = str.replace(/"/g, '""');
    return needsWrap ? `"${escaped}"` : escaped;
  };

  const lines = [headers.join(",")];

  rows.forEach((row) => {
    lines.push(
      [
        row.order_id,
        formatDate(row.created_at),
        row.status || "N/A",
        row.vendor_name || "N/A",
        row.main_service || "N/A",
        formatServiceCategory(row.pickup_details),
        formatItems(row.items),
        getItemCount(row.items),
        row.total_price,
        row.payment_method || "N/A",
        row.payment_status || "N/A",
        row.customer_name || "N/A",
        row.customer_phone || "N/A",
        row.rider_name || "Not assigned",
        formatPickupLocation(row.pickup_details),
        formatDeliveryLocation(row.delivery_details),
      ]
        .map(escape)
        .join(",")
    );
  });

  const blob = new Blob(["\ufeff" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

