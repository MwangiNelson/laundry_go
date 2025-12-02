"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";

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

const chartData = [
  { day: "Mon", currentWeek: 180, previousWeek: 120 },
  { day: "Tue", currentWeek: 250, previousWeek: 180 },
  { day: "Wed", currentWeek: 200, previousWeek: 220 },
  { day: "Thu", currentWeek: 280, previousWeek: 150 },
  { day: "Fri", currentWeek: 220, previousWeek: 190 },
  { day: "Sat", currentWeek: 300, previousWeek: 240 },
  { day: "Sun", currentWeek: 260, previousWeek: 200 },
];

const chartConfig = {
  currentWeek: {
    label: "Current Week",
    color: "var(--title)",
  },
  previousWeek: {
    label: "Previous Week",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

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
  return (
    <Card className="bg-card rounded-2xl border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-base text-title font-manrope leading-[1.6]">
            Total Orders
          </h3>
          <LegendDot color="var(--title)" label="Current Week" />
          <LegendDot color="var(--chart-2)" label="Previous Week" />
        </div>
        <Select defaultValue="today">
          <SelectTrigger className="border-none shadow-none p-0 h-auto gap-1 font-manrope text-sm text-title">
            <SelectValue placeholder="Today" />
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
              dataKey="day"
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
              domain={[0, 300]}
              ticks={[0, 100, 200, 300]}
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
              dataKey="currentWeek"
              type="monotone"
              stroke="var(--color-currentWeek)"
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
              dataKey="previousWeek"
              type="monotone"
              stroke="var(--color-previousWeek)"
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
