"use client";

import { Pie, PieChart, Cell } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartData = [
  { name: "Laundry", value: 50000, fill: "hsl(225, 100%, 50%)" },
  { name: "House Cleaning", value: 25000, fill: "hsl(30, 100%, 60%)" },
  { name: "Office Cleaning", value: 15000, fill: "hsl(120, 60%, 50%)" },
  { name: "Moving", value: 50000, fill: "hsl(200, 100%, 60%)" },
  { name: "Fumigation", value: 25000, fill: "hsl(0, 80%, 60%)" },
];

const chartConfig = {
  value: {
    label: "Revenue",
  },
  laundry: {
    label: "Laundry",
    color: "hsl(225, 100%, 50%)",
  },
  houseCleaning: {
    label: "House Cleaning",
    color: "hsl(30, 100%, 60%)",
  },
  officeCleaning: {
    label: "Office Cleaning",
    color: "hsl(120, 60%, 50%)",
  },
  moving: {
    label: "Moving",
    color: "hsl(200, 100%, 60%)",
  },
  fumigation: {
    label: "Fumigation",
    color: "hsl(0, 80%, 60%)",
  },
} satisfies ChartConfig;

interface LegendItemProps {
  color: string;
  label: string;
  value: string;
}

const LegendItem = ({ color, label, value }: LegendItemProps) => (
  <div className="flex items-center justify-between w-full rounded-lg">
    <div className="flex items-center gap-1 pl-1 pr-2 py-0.5">
      <div
        className="size-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium text-title tracking-[0.5px] font-manrope">
        {label}
      </span>
    </div>
    <span className="text-xs font-normal text-title">{value}</span>
  </div>
);

export function TotalRevenue() {
  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const orderCount = 1234;

  return (
    <Card className="bg-card rounded-2xl border-none shadow-none flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between p-6 pb-0 gap-2">
        <h3 className="font-bold text-base text-title font-manrope leading-[1.6] flex-1">
          Total Revenue
        </h3>
        <Tabs defaultValue="income" className="w-auto">
          <TabsList className="bg-transparent border-none shadow-none p-0 h-auto gap-2">
            <TabsTrigger
              value="income"
              className="border-none shadow-none p-0 h-auto font-manrope text-sm text-title data-[state=active]:text-title data-[state=active]:font-semibold"
            >
              Income
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="border-none shadow-none p-0 h-auto font-manrope text-sm text-title data-[state=active]:text-title data-[state=active]:font-semibold"
            >
              Orders
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 p-6 pt-2">
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[160px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="bg-card" hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-title font-manrope">
              {orderCount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground font-manrope">
              ${(totalRevenue / 1000).toFixed(3).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 w-full">
          <LegendItem
            color="hsl(225, 100%, 50%)"
            label="Laundry"
            value="kes50,000"
          />
          <LegendItem
            color="hsl(30, 100%, 60%)"
            label="House Cleaning"
            value="kes25,000"
          />
          <LegendItem
            color="hsl(120, 60%, 50%)"
            label="Office Cleaning"
            value="kes15,000"
          />
          <LegendItem
            color="hsl(200, 100%, 60%)"
            label="Moving"
            value="kes50,000"
          />
          <LegendItem
            color="hsl(0, 80%, 60%)"
            label="Fumigation"
            value="kes25,000"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalRevenue;
