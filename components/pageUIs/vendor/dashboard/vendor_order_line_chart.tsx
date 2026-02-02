"use client";

import { useState, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useVendorOrdersChart,
  ChartPeriod,
} from "@/api/vendor/dashboard/use_vendor_dashboard";
import { Skeleton } from "@/components/ui/skeleton";

const periodLabels: Record<ChartPeriod, { current: string; previous: string }> =
  {
    today: { current: "Today", previous: "Yesterday" },
    week: { current: "This Week", previous: "Last Week" },
    month: { current: "This Month", previous: "Last Month" },
  };

const getChartConfig = (period: ChartPeriod): ChartConfig => ({
  currentPeriod: {
    label: periodLabels[period].current,
    color: "var(--title)",
  },
  previousPeriod: {
    label: periodLabels[period].previous,
    color: "var(--chart-2)",
  },
});

interface LegendDotProps {
  color: string;
  label: string;
}

const LegendDot = ({ color, label }: LegendDotProps) => (
  <div className="flex items-center gap-1 px-1 py-0.5 rounded-lg">
    <div className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-xs font-medium text-title tracking-[0.5px]">
      {label}
    </span>
  </div>
);

export function VendorOrderLineChart() {
  const [period, setPeriod] = useState<ChartPeriod>("week");
  const { data: chartDataRaw, isLoading } = useVendorOrdersChart({ period });

  const chartData = useMemo(() => {
    if (!chartDataRaw) return [];
    return chartDataRaw.map((item) => ({
      label: item.label,
      currentPeriod: item.current_period,
      previousPeriod: item.previous_period,
    }));
  }, [chartDataRaw]);

  const chartConfig = useMemo(() => getChartConfig(period), [period]);

  const maxValue = useMemo(() => {
    if (!chartData.length) return 10;
    const max = Math.max(
      ...chartData.map((d) => Math.max(d.currentPeriod, d.previousPeriod))
    );
    return Math.ceil(max / 5) * 5 || 10;
  }, [chartData]);

  const ticks = useMemo(() => {
    const tickCount = 4;
    const step = Math.ceil(maxValue / tickCount);
    return Array.from({ length: tickCount + 1 }, (_, i) => i * step);
  }, [maxValue]);

  if (isLoading) {
    return (
      <Card className="bg-card rounded-2xl border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-6 w-[100px]" />
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-2xl border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-base text-title font-manrope leading-[1.6]">
            Total Orders
          </h3>
          <LegendDot
            color="var(--title)"
            label={periodLabels[period].current}
          />
          <LegendDot
            color="var(--chart-2)"
            label={periodLabels[period].previous}
          />
        </div>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as ChartPeriod)}
        >
          <SelectTrigger className="border-none shadow-none p-0 h-auto gap-1 font-manrope text-sm text-title">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent className="border border-border ring-0">
            <SelectGroup>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
                fontFamily: "var(--font-manrope)",
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
                fontFamily: "var(--font-manrope)",
              }}
              domain={[0, maxValue]}
              ticks={ticks}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-card/80 backdrop-blur-[20px] text-white border-none rounded-lg"
                  labelClassName="text-white"
                />
              }
            />
            <Line
              dataKey="currentPeriod"
              type="monotone"
              stroke="var(--color-currentPeriod)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: "var(--chart-2)",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
            <Line
              dataKey="previousPeriod"
              type="monotone"
              stroke="var(--color-previousPeriod)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: "var(--chart-2)",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
