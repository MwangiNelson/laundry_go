"use client";

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

const chartData = [
  {
    day: "Mon",
    laundry: 180,
    houseCleaning: 280,
    officeCleaning: 150,
    moving: 80,
    fumigation: 20,
  },
  {
    day: "Tue",
    laundry: 150,
    houseCleaning: 270,
    officeCleaning: 80,
    moving: 20,
    fumigation: 50,
  },
  {
    day: "Wed",
    laundry: 220,
    houseCleaning: 190,
    officeCleaning: 120,
    moving: 80,
    fumigation: 10,
  },
  {
    day: "Thu",
    laundry: 310,
    houseCleaning: 250,
    officeCleaning: 30,
    moving: 80,
    fumigation: 60,
  },
  {
    day: "Fri",
    laundry: 280,
    houseCleaning: 260,
    officeCleaning: 110,
    moving: 110,
    fumigation: 30,
  },
  {
    day: "Sat",
    laundry: 160,
    houseCleaning: 160,
    officeCleaning: 160,
    moving: 80,
    fumigation: 20,
  },
  {
    day: "Sun",
    laundry: 200,
    houseCleaning: 150,
    officeCleaning: 60,
    moving: 160,
    fumigation: 100,
  },
];

const chartConfig = {
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

export function ServicesPerformanceLineChart() {
  return (
    <Card className="bg-card rounded-2xl border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-base text-title font-manrope leading-[1.6]">
            Service Performance
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            <LegendDot color="hsl(225, 100%, 50%)" label="Laundry" />
            <LegendDot color="hsl(30, 100%, 60%)" label="House Cleaning" />
            <LegendDot color="hsl(120, 60%, 50%)" label="Office Cleaning" />
            <LegendDot color="hsl(200, 100%, 60%)" label="Moving" />
            <LegendDot color="hsl(0, 80%, 60%)" label="Fumigation" />
          </div>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="border-none shadow-none p-0 h-auto gap-1 font-manrope text-sm text-title">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent className="border border-border ring-0">
            <SelectGroup>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
              dataKey="laundry"
              type="monotone"
              stroke="hsl(225, 100%, 50%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="houseCleaning"
              type="monotone"
              stroke="hsl(30, 100%, 60%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="officeCleaning"
              type="monotone"
              stroke="hsl(120, 60%, 50%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="moving"
              type="monotone"
              stroke="hsl(200, 100%, 60%)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="fumigation"
              type="monotone"
              stroke="hsl(0, 80%, 60%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ServicesPerformanceLineChart;
