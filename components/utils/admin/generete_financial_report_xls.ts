import type {
  AdminFinancialReportRow,
  AdminPaymentRow,
} from "@/api/admin/reports/use_reports.admin";

export const downloadAdminFinancialReportCsv = (
  summary: AdminFinancialReportRow | null | undefined,
  payments: AdminPaymentRow[] | null | undefined,
  filename = "admin-financial-report.csv"
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
        ["Total Completed Paid Orders", summary.total_completed_paid_orders],
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

  // Nominal payments section (admin version includes vendor name)
  if (payments && payments.length > 0) {
    lines.push("Payments");
    lines.push(
      [
        "Paid At",
        "Order Id",
        "Amount",
        "Order Status",
        "Vendor Name",
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
          row.vendor_name,
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

