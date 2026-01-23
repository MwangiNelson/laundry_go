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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Download, RefreshCw } from "lucide-react";
import {
  endOfDay,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subMonths,
  subQuarters,
  subYears,
} from "date-fns";
import { useAdminTransactionStats } from "@/api/admin/transactions/use_transactions_admin";
import { AdminTransactionsTable } from "@/components/tables/admin/transaction/transactions.table";

type Period = "month" | "quarter" | "year";
type Status = "all" | "paid" | "pending" | "failed";

// TODO: We'll fetch and render the transactions table from Supabase next.

const formatCurrency = (n: number) =>
  `KES ${n.toLocaleString("en-KE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;

export function TransactionsPageUIAdmin() {
  const [period, setPeriod] = React.useState<Period>("month");
  const [status, setStatus] = React.useState<Status>("all");

  const dateRange = React.useMemo(() => {
    const now = new Date();
    switch (period) {
      case "month":
        return { start: startOfMonth(now), end: endOfDay(now) };
      case "quarter":
        return { start: startOfQuarter(now), end: endOfDay(now) };
      case "year":
        return { start: startOfYear(now), end: endOfDay(now) };
      default:
        return { start: startOfMonth(now), end: endOfDay(now) };
    }
  }, [period]);

  const prevDateRange = React.useMemo(() => {
    switch (period) {
      case "month": {
        const prevEnd = subMonths(dateRange.start, 1);
        return { start: startOfMonth(prevEnd), end: endOfDay(prevEnd) };
      }
      case "quarter": {
        const prevEnd = subQuarters(dateRange.start, 1);
        return { start: startOfQuarter(prevEnd), end: endOfDay(prevEnd) };
      }
      case "year": {
        const prevEnd = subYears(dateRange.start, 1);
        return { start: startOfYear(prevEnd), end: endOfDay(prevEnd) };
      }
      default: {
        const prevEnd = subMonths(dateRange.start, 1);
        return { start: startOfMonth(prevEnd), end: endOfDay(prevEnd) };
      }
    }
  }, [dateRange.start, period]);

  const { data: stats, refetch, isFetching } = useAdminTransactionStats({
    startDate: dateRange.start,
    endDate: dateRange.end,
    status,
  });

  const { data: prevStats } = useAdminTransactionStats({
    startDate: prevDateRange.start,
    endDate: prevDateRange.end,
    status,
  });

  const calcChange = (currentRaw: unknown, prevRaw: unknown) => {
    const current = Number(currentRaw ?? 0);
    const previous = Number(prevRaw ?? 0);

    if (!previous || Number.isNaN(previous)) {
      if (!current || Number.isNaN(current)) return "+0.00%";
      // Treat going from 0 -> current as 100%+ increase, but cap for display
      return "+100.00%";
    }

    const diff = ((current - previous) / previous) * 100;
    const formatted = diff.toFixed(2);
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${formatted}%`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Date Range
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className="h-4 w-4" />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <StatCard>
        <StatCardHeader>
          <StatCardSelect
            options={[
              { value: "month", label: "This Month" },
              { value: "quarter", label: "This Quarter" },
              { value: "year", label: "This Year" },
            ]}
            defaultValue={period}
            onValueChange={(v) => setPeriod(v as Period)}
          />
        </StatCardHeader>
        <StatCardContent>
          <StatItem
            label="Total Revenue (kes)"
            value={formatCurrency(Number(stats?.total_revenue ?? 0))}
            variant="blue"
            percentageChange={calcChange(
              stats?.total_revenue,
              prevStats?.total_revenue
            )}
          />
          <StatItem
            label="Commission (kes)"
            value={formatCurrency(Number(stats?.commission ?? 0))}
            variant="purple"
            percentageChange={calcChange(
              stats?.commission,
              prevStats?.commission
            )}
          />
          <StatItem
            label="Vendor pay-outs (kes)"
            value={formatCurrency(Number(stats?.vendor_payouts ?? 0))}
            variant="blue"
            percentageChange={calcChange(
              stats?.vendor_payouts,
              prevStats?.vendor_payouts
            )}
          />
          <StatItem
            label="Refunds Issued (kes)"
            value={formatCurrency(Number(stats?.refunds_issued ?? 0))}
            variant="purple"
            percentageChange={calcChange(
              stats?.refunds_issued,
              prevStats?.refunds_issued
            )}
          />
          <StatItem
            label="Pending Commissions"
            value={Number(stats?.pending_commissions ?? 0).toLocaleString()}
            variant="blue"
            percentageChange={calcChange(
              stats?.pending_commissions,
              prevStats?.pending_commissions
            )}
          />
        </StatCardContent>
      </StatCard>

     <AdminTransactionsTable/>
    </div>
  );
}
