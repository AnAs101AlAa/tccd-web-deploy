import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useGetEventUniversityDistributionStats } from "@/shared/queries/admin/stats/statsQueries";

interface UniversityDistributionChartProps {
  eventId: string;
}

const UniversityDistributionChart: React.FC<UniversityDistributionChartProps> = ({ eventId }) => {
  const colors = useThemeColors();
  const { data, isLoading, error } = useGetEventUniversityDistributionStats(eventId);

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];
    return [...data.distribution]
      .map(item => ({
        name: item.university,
        value: item.count
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contrast"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
        <p className="text-muted-foreground">Failed to load university distribution.</p>
      </div>
    );
  }

  const option = {
    grid: {
      top: "5%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: { type: "dashed", color: "#f3f4f6" },
      },
    },
    yAxis: {
      type: "category",
      data: chartData.map((item) => item.name).reverse(),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: colors.contrast,
        fontWeight: 500,
        interval: 0,
        width: 140,
        overflow: "truncate",
      },
    },
    series: [
      {
        name: "Attendees",
        type: "bar",
        data: chartData.map((item) => item.value).reverse(),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: colors.mutedPrimary },
              { offset: 1, color: colors.primary },
            ],
          },
          borderRadius: [0, 4, 4, 0] as number[],
        },
        barWidth: 20,
      },
    ],
  };
  
  // Dynamic height based on number of items to ensure bars don't get squished
  const chartHeight = Math.max(600, chartData.length * 40);

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-contrast mb-4">
        University Distribution
      </h3>
      <div className="flex-1 h-[600px] overflow-y-auto custom-scrollbar">
        <ReactECharts
          option={option}
          style={{ height: `${chartHeight}px`, width: "100%" }}
        />
      </div>
    </div>
  );
};

export default UniversityDistributionChart;
