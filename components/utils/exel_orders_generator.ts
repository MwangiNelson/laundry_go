export type OrdersReportRow = {
  order_id: string;
  created_at: string;
  updated_at: string;
  status: string | null;
  main_service: string | null;
  items: unknown;
  total_price: number;
  payment_method: string | null;
  payment_channel: string | null;
  payment_status: string | null;
  payment_reference: string | null;
  payment_verified_at: string | null;
  customer_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  vendor_id: string;
  vendor_name: string | null;
  rider_id: string | null;
  rider_name: string | null;
  pickup_details: unknown;
  delivery_details: unknown;
};

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
      const services = item.services && item.services.length > 0 
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

// Helper to format pickup details
const formatPickupLocation = (details: unknown): string => {
  if (!details || typeof details !== "object") return "";
  const d = details as LocationDetails;
  return d.location || "";
};

const formatPickupType = (details: unknown): string => {
  if (!details || typeof details !== "object") return "";
  const d = details as LocationDetails;
  return d.type || "";
};

const formatServiceCategory = (details: unknown): string => {
  if (!details || typeof details !== "object") return "";
  const d = details as LocationDetails;
  return d.service_category || "";
};

// Helper to format delivery details
const formatDeliveryLocation = (details: unknown): string => {
  if (!details || typeof details !== "object") return "";
  const d = details as LocationDetails;
  return d.location || d.destination || "";
};

// Helper to format date in a more readable way
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

// Simple CSV export that opens a client-side download. Avoids pulling in heavy XLSX dependency.
export const downloadOrdersReportCsv = (
  rows: OrdersReportRow[] | null | undefined,
  filename = "orders-report.csv"
) => {
  if (!rows || rows.length === 0) return;

  const headers = [
    "Order Id",
    "Date Created",
    "Status",
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
    "Pickup Type",
    "Pickup Location",
    "Delivery Location",
  ];

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value.toString();
    const str = String(value);
    // Escape quotes and wrap in quotes if needed
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
        formatPickupType(row.pickup_details),
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

export type FinancialReportRow = {
  vendor_id: string;
  total_paid_orders: number;
  total_revenue: number;
  average_order_value: number;
  min_order_value: number | null;
  max_order_value: number | null;
  report_start: string | null;
  report_end: string | null;
};

export const downloadFinancialReportCsv = (
  report: FinancialReportRow | null | undefined,
  filename = "financial-report.csv"
) => {
  if (!report) return;

  const headers = ["Metric", "Value"];
  const lines = [headers.join(",")];

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value.toString();
    const str = String(value);
    const needsWrap = /[",\n]/.test(str);
    const escaped = str.replace(/"/g, '""');
    return needsWrap ? `"${escaped}"` : escaped;
  };

  const rows: Array<[string, unknown]> = [
    ["Total Paid Orders", report.total_paid_orders],
    ["Total Revenue", report.total_revenue],
    ["Average Order Value", report.average_order_value],
    ["Min Order Value", report.min_order_value],
    ["Max Order Value", report.max_order_value],
    ["Report Start", report.report_start],
    ["Report End", report.report_end],
  ];

  rows.forEach(([metric, value]) => {
    lines.push([metric, value].map(escape).join(","));
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

export type VendorPaymentRow = {
  order_id: string;
  paid_at: string | null;
  amount: number;
  order_status: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: string | null;
  payment_channel: string | null;
  payment_reference: string | null;
};

export const downloadPaymentsReportCsv = (
  rows: VendorPaymentRow[] | null | undefined,
  filename = "payments-report.csv"
) => {
  if (!rows || rows.length === 0) return;

  const headers = [
    "Paid At",
    "Order Id",
    "Amount",
    "Order Status",
    "Customer Name",
    "Customer Phone",
    "Payment Method",
    "Payment Channel",
    "Payment Reference",
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
        row.paid_at,
        row.order_id,
        row.amount,
        row.order_status,
        row.customer_name,
        row.customer_phone,
        row.payment_method,
        row.payment_channel,
        row.payment_reference,
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

export const downloadNominalFinancialReportCsv = (
  summary: FinancialReportRow | null | undefined,
  payments: VendorPaymentRow[] | null | undefined,
  filename = "financial-report.csv"
) => {
  if ((!payments || payments.length === 0) && !summary) return;

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value.toString();
    const str = String(value);
    const needsWrap = /[",\n]/.test(str);
    const escaped = str.replace(/"/g, '""');
    return needsWrap ? `"${escaped}"` : escaped;
  };

  const lines: string[] = [];

  // Summary section
  if (summary) {
    lines.push(["Metric", "Value"].join(","));
    (
      [
        ["Total Paid Orders", summary.total_paid_orders],
        ["Total Revenue", summary.total_revenue],
        ["Average Order Value", summary.average_order_value],
        ["Min Order Value", summary.min_order_value],
        ["Max Order Value", summary.max_order_value],
        ["Report Start", summary.report_start],
        ["Report End", summary.report_end],
      ] as Array<[string, unknown]>
    ).forEach(([metric, value]) => {
      lines.push([metric, value].map(escape).join(","));
    });
    lines.push(""); // blank line between sections
  }

  // Nominal payments section
  if (payments && payments.length > 0) {
    lines.push("Payments");
    lines.push(
      [
        "Paid At",
        "Order Id",
        "Amount",
        "Order Status",
        "Customer Name",
        "Customer Phone",
        "Payment Method",
        "Payment Channel",
        "Payment Reference",
      ].join(",")
    );

    payments.forEach((row) => {
      lines.push(
        [
          row.paid_at,
          row.order_id,
          row.amount,
          row.order_status,
          row.customer_name,
          row.customer_phone,
          row.payment_method,
          row.payment_channel,
          row.payment_reference,
        ]
          .map(escape)
          .join(",")
      );
    });
  }

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
