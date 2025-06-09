"use client";
import { getMonthlyTopTagChartData } from "@/apis/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Top Tag",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
export function NewThreadsChart() {
  const [chartData, setChartData] = useState<
    { month: string; desktop: number }[]
  >([]);
  // console.log("NewThreadsChart rendered with chartData:", chartData); // It's good practice to remove console.logs in production
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getMonthlyTopTagChartData();
        const formattedData = rawData.map((item) => ({
          month: item.month + "( " + item.topTag + " )", // This 'month' field should contain the tag name
          desktop: item.tagFrequency,
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>BIỂU ĐỒ TOP CHỦ ĐỀ</CardTitle>
        <CardDescription>7/2024 - 6/2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="desktop" />
            <YAxis
              width={200}
              dataKey="month" // This dataKey provides the label for the tooltip
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tickFormatter={(value) => value.slice(0, 20)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />} // Removed hideLabel prop
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
