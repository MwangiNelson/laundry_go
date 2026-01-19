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

// Simple CSV export that opens a client-side download. Avoids pulling in heavy XLSX dependency.
export const downloadOrdersReportCsv = (
  rows: OrdersReportRow[] | null | undefined,
  filename = "orders-report.csv"
) => {
  if (!rows || rows.length === 0) return;

  const headers = [
    "order_id",
    "created_at",
    "updated_at",
    "status",
    "main_service",
    "total_price",
    "payment_method",
    "payment_channel",
    "payment_status",
    "payment_reference",
    "payment_verified_at",
    "customer_name",
    "customer_phone",
    "vendor_name",
    "rider_name",
    "pickup_details",
    "delivery_details",
    "items",
  ];

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value.toString();
    const str = typeof value === "string" ? value : JSON.stringify(value);
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
        row.created_at,
        row.updated_at,
        row.status,
        row.main_service,
        row.total_price,
        row.payment_method,
        row.payment_channel,
        row.payment_status,
        row.payment_reference,
        row.payment_verified_at,
        row.customer_name,
        row.customer_phone,
        row.vendor_name,
        row.rider_name,
        row.pickup_details,
        row.delivery_details,
        row.items,
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
