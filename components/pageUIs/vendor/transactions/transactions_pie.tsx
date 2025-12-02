"use client";

import { Pie, PieChart, Cell } from "recharts";

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
  { name: "Laundry", value: 85, fill: "var(--chart-1)" },
  { name: "Moving", value: 85, fill: "var(--chart-2)" },
  { name: "Cleaning", value: 15, fill: "var(--title)" },
  { name: "Fumigation", value: 15, fill: "var(--muted-foreground)" },
];

const chartConfig = {
  value: {
    label: "Earnings",
  },
  laundry: {
    label: "Laundry",
    color: "var(--chart-1)",
  },
  moving: {
    label: "Moving",
    color: "var(--chart-2)",
  },
  cleaning: {
    label: "Cleaning",
    color: "var(--title)",
  },
  fumigation: {
    label: "Fumigation",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

interface LegendItemProps {
  color: string;
  label: string;
  percentage: string;
}

const LegendItem = ({ color, label, percentage }: LegendItemProps) => (
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
    <span className="text-xs font-normal text-title">{percentage}</span>
  </div>
);

export function TransactionsPie() {
  return (
    <Card className="bg-card rounded-2xl border-none shadow-none flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between p-6 pb-0 gap-2">
        <h3 className="font-bold text-base text-title font-manrope leading-[1.6] flex-1">
          Earnings by Service
        </h3>
        <Select defaultValue="month">
          <SelectTrigger className="border-none shadow-none p-0 h-auto gap-1 font-manrope text-sm text-title w-auto">
            <SelectValue placeholder="This Month" />
          </SelectTrigger>
          <SelectContent className="border border-border ring-0">
            <SelectGroup>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-row  items-center justify-center gap-3 p-6 pt-2 flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[120px]"
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
              innerRadius={35}
              outerRadius={55}
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-col gap-3 w-[140px]">
          <LegendItem color="var(--chart-1)" label="Laundry" percentage="85%" />
          <LegendItem color="var(--chart-2)" label="Moving" percentage="85%" />
          <LegendItem color="var(--title)" label="Cleaning" percentage="15%" />
          <LegendItem
            color="var(--muted-foreground)"
            label="Fumigation"
            percentage="15%"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionsPie;
