import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useGetEventGenderDistributionStats } from "@/shared/queries/admin/stats/statsQueries";

interface GenderDistributionChartProps {
  eventId: string;
}

/*Shared Tooltip Style */

const tooltipStyle = {
  extraCssText:
    "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.10); padding: 12px 16px; color: #1f2937;",
  textStyle: { color: "#374151", fontSize: 13 },
};

/*Skeleton */

const PieSkeleton = () => (
  <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col justify-between h-full min-h-[400px] animate-pulse">
    <div className="h-5 w-40 bg-contrast/10 rounded-lg mb-4" />
    <div className="flex-1 flex items-center justify-center">
      <div className="w-36 h-36 rounded-full bg-contrast/8 border-[6px] border-contrast/5" />
    </div>
    <div className="border-t border-contrast/5 pt-4 mt-2 flex flex-wrap justify-around gap-x-6 gap-y-3">
      <div className="flex flex-col items-center gap-2 min-w-[90px]">
        <div className="h-8 w-14 bg-contrast/10 rounded-md" />
        <div className="h-3 w-12 bg-contrast/5 rounded" />
      </div>
      <div className="flex flex-col items-center gap-2 min-w-[90px]">
        <div className="h-8 w-14 bg-contrast/10 rounded-md" />
        <div className="h-3 w-12 bg-contrast/5 rounded" />
      </div>
    </div>
  </div>
);

/*Main Component*/

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  eventId,
}) => {
  const colors = useThemeColors();
  const { data, isLoading, error } =
    useGetEventGenderDistributionStats(eventId);

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];

    const males =
      data.distribution.find(
        (d) =>
          String(d.gender).toLowerCase() === "male" || String(d.gender) === "0",
      )?.count || 0;
    const females =
      data.distribution.find(
        (d) =>
          String(d.gender).toLowerCase() === "female" ||
          String(d.gender) === "1",
      )?.count || 0;

    return [
      { value: males, name: "Male" },
      { value: females, name: "Female" },
    ];
  }, [data]);

  if (isLoading) {
    return <PieSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
        <p className="text-inactive-tab-text">
          Failed to load gender distribution.
        </p>
      </div>
    );
  }

  const option = {
    color: [colors.secondary, colors.primary],
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
      ...tooltipStyle,
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Gender",
        type: "pie",
        radius: "72%",
        center: ["50%", "52%"],
        data: chartData,
        emphasis: {
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 16,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.15)",
          },
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: colors.background,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
      },
    ],
  };

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-contrast mb-2 tracking-tight">
        Gender Distribution
      </h3>
      <div className="flex-1 min-h-[200px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      <div className="flex flex-wrap justify-around items-center gap-x-6 gap-y-3 pt-4 border-t border-contrast/5 mt-2">
        <div className="flex flex-col items-center min-w-[100px]">
          <span
            className="text-3xl font-extrabold tracking-tight tabular-nums"
            style={{ color: colors.secondary }}
          >
            {chartData[0]?.value || 0}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.secondary }}
            />
            <span className="text-sm text-inactive-tab-text font-medium">
              Male
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center min-w-[100px]">
          <span
            className="text-3xl font-extrabold tracking-tight tabular-nums"
            style={{ color: colors.primary }}
          >
            {chartData[1]?.value || 0}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-sm text-inactive-tab-text font-medium">
              Female
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderDistributionChart;
