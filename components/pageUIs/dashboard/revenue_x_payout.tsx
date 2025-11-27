// https://www.figma.com/design/2MdwcLxruaMKEFA6oQCFkq/Auth?node-id=13-1334&m=dev
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", revenue: 20, payout: 16 },
  { month: "Feb", revenue: 28, payout: 22 },
  { month: "Mar", revenue: 22, payout: 18 },
  { month: "Apr", revenue: 30, payout: 24 },
  { month: "May", revenue: 18, payout: 14 },
  { month: "Jun", revenue: 28, payout: 22 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
  payout: {
    label: "Payout",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function RevenuePayoutChart() {
  return (
    <Card className="bg-card rounded-2xl border-none shadow-none">
      <CardHeader className="p-6 pb-0">
        <h3 className="font-bold text-base text-title font-manrope leading-[1.6]">
          Revenue vs. Payouts
        </h3>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
              domain={[0, 30]}
              ticks={[0, 10, 20, 30]}
              tickFormatter={(value) => `${value}M`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-title/80 backdrop-blur-[20px] text-white border-none rounded-lg"
                  labelClassName="text-white"
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
              barSize={20}
              fillOpacity={0.5}
            />
            <Bar
              dataKey="payout"
              fill="var(--color-payout)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default RevenuePayoutChart;
