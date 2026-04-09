import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useGetEventUniversityDistributionStats } from "@/shared/queries/admin/stats/statsQueries";
import UniversityList from "@/constants/universityList";
import { DropdownMenu } from "tccd-ui";

interface UniversityDistributionChartProps {
  eventId: string;
}

/*Shared Tooltip Style */

const tooltipStyle = {
  extraCssText:
    "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.10); padding: 12px 16px; color: #1f2937;",
  textStyle: { color: "#374151", fontSize: 13 },
};

/*Skeleton */

const BarChartSkeleton = () => (
  <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="h-5 w-44 bg-contrast/10 rounded-lg" />
      <div className="h-10 w-52 bg-contrast/8 rounded-lg" />
    </div>
    <div className="flex-1 min-h-[340px] flex items-end justify-around gap-3 pb-8 px-4">
      {[65, 85, 45, 70, 55, 90, 40, 75].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-contrast/8 rounded-t-lg"
            style={{ height: `${h}%` }}
          />
          <div className="h-3 w-10 bg-contrast/5 rounded" />
        </div>
      ))}
    </div>
  </div>
);

/*Dropdown Options */

const universityOptions = [
  { value: "All", label: "All Universities" },
  ...UniversityList.map((u) => ({ value: u, label: u })),
];

/*Main Component*/

const UniversityDistributionChart: React.FC<
  UniversityDistributionChartProps
> = ({ eventId }) => {
  const colors = useThemeColors();
  const [selectedUniversity, setSelectedUniversity] = useState<string>("All");
  const { data, isLoading, error } =
    useGetEventUniversityDistributionStats(eventId);

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];

    const query = selectedUniversity.trim().toLowerCase();

    const filteredUnivs =
      selectedUniversity === "All"
        ? data.distribution
        : data.distribution.filter(
            (u) =>
              u.university.trim().toLowerCase() === query ||
              u.university.trim().toLowerCase().includes(query) ||
              query.includes(u.university.trim().toLowerCase()),
          );

    return [...filteredUnivs]
      .map((item) => ({
        name: item.university,
        value: item.count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, selectedUniversity]);

  if (isLoading) {
    return <BarChartSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
        <p className="text-inactive-tab-text">
          Failed to load university distribution.
        </p>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      ...tooltipStyle,
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: "#6b7280", fontSize: 12 },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "12%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: chartData.length > 8 ? 40 : 100,
        bottom: 0,
        height: 22,
        borderColor: "transparent",
        fillerColor: "rgba(107, 114, 128, 0.15)",
        handleStyle: { color: colors.secondary, borderColor: colors.secondary },
        dataBackground: {
          lineStyle: { color: "rgba(0,0,0,0.05)" },
          areaStyle: { color: "rgba(0,0,0,0.02)" },
        },
      },
      {
        type: "inside",
        xAxisIndex: [0],
      },
    ],
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.name),
      axisLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } },
      axisTick: { show: false },
      axisLabel: {
        color: colors.contrast,
        interval: 0,
        rotate: 30,
        width: 100,
        overflow: "truncate",
        fontSize: 11,
      },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "rgba(0,0,0,0.05)" } },
      axisLabel: {
        color: colors.contrast,
        fontSize: 12,
      },
    },
    series: [
      {
        name: "Attendees",
        type: "bar",
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0,0,0,0.12)",
          },
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.primary },
              { offset: 1, color: "rgba(205,58,56,0.08)" },
            ],
          },
          borderRadius: [6, 6, 0, 0] as number[],
        },
        data: chartData.map((d) => d.value),
        barMaxWidth: 32,
      },
    ],
  };

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-contrast tracking-tight">
          University Distribution
        </h3>

        <div className="w-full sm:w-56">
          <DropdownMenu
            placeholder="All Universities"
            options={universityOptions}
            value={selectedUniversity}
            onChange={(value) => setSelectedUniversity(value)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default UniversityDistributionChart;
