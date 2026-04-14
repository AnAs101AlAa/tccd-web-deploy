import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import {
  useGetUsersGenderStats,
  useGetUsersStatusStats,
  useGetUsersGraduationYearStats,
  useGetUsersUniversitiesStats,
} from "@/shared/queries/admin/stats/statsQueries";

/*Shared Tooltip Style */

const tooltipStyle = {
  extraCssText:
    "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.10); padding: 12px 16px; color: #1f2937;",
  textStyle: { color: "#374151", fontSize: 13 },
};

/*Card Skeleton */

const CardSkeleton = ({ variant = "pie" }: { variant?: "pie" | "bar" }) => (
  <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col gap-4 animate-pulse">
    <div className="h-5 w-36 bg-contrast/10 rounded-lg" />
    <div className="flex-1 min-h-[250px] flex items-center justify-center">
      {variant === "pie" ? (
        <div className="w-36 h-36 rounded-full bg-contrast/8 border-[6px] border-contrast/5" />
      ) : (
        <div className="flex items-end justify-around w-full h-[200px] gap-2 px-4">
          {[60, 85, 40, 70, 55].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-contrast/8 rounded-t-md"
                style={{ height: `${h}%` }}
              />
              <div className="h-3 w-8 bg-contrast/5 rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="border-t border-contrast/5 pt-4 flex flex-wrap justify-around gap-x-4 gap-y-3">
      {Array.from({ length: variant === "pie" ? 2 : 0 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="h-7 w-12 bg-contrast/10 rounded-md" />
          <div className="h-3 w-14 bg-contrast/5 rounded" />
        </div>
      ))}
    </div>
  </div>
);

/*Global Gender Chart */

const GlobalGenderChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersGenderStats();

  const option = {
    color: [colors.secondary, colors.primary],
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)", ...tooltipStyle },
    series: [
      {
        type: "pie",
        radius: ["42%", "72%"],
        data: data
          ? [
              { value: data.males, name: "Male" },
              { value: data.females, name: "Female" },
            ]
          : [],
        label: { show: false },
        itemStyle: {
          borderWidth: 3,
          borderColor: colors.background,
        },
        emphasis: {
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: "rgba(0,0,0,0.15)",
          },
        },
      },
    ],
  };

  if (isLoading) return <CardSkeleton variant="pie" />;

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-lg font-semibold text-contrast tracking-tight">
        Total Users Gender
      </h3>
      <div className="flex-1 min-h-[250px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      {/* Stats Footer */}
      {data && (
        <div className="flex flex-wrap justify-around items-center gap-x-6 gap-y-3 pt-4 border-t border-contrast/5 mt-2">
          <div className="flex flex-col items-center min-w-[90px]">
            <span
              className="text-3xl font-extrabold tracking-tight tabular-nums"
              style={{ color: colors.secondary }}
            >
              {data.males}
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
          <div className="flex flex-col items-center min-w-[90px]">
            <span
              className="text-3xl font-extrabold tracking-tight tabular-nums"
              style={{ color: colors.primary }}
            >
              {data.females}
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
      )}
    </div>
  );
};

/*Global Status Chart */

const GlobalStatusChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersStatusStats();

  const option = {
    color: [
      colors.secondary,
      colors.primary,
      colors.mutedPrimary,
      colors.contrast,
    ],
    tooltip: { trigger: "item", ...tooltipStyle },
    series: [
      {
        type: "pie",
        radius: "72%",
        data: data ? data.map((d) => ({ name: d.status, value: d.count })) : [],
        label: { show: false },
        itemStyle: {
          borderWidth: 3,
          borderColor: colors.background,
        },
        emphasis: {
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: "rgba(0,0,0,0.15)",
          },
        },
      },
    ],
  };

  if (isLoading) return <CardSkeleton variant="pie" />;

  const chartColors = [
    colors.secondary,
    colors.primary,
    colors.mutedPrimary,
    colors.contrast,
  ];

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-lg font-semibold text-contrast tracking-tight">
        Total Users Status
      </h3>
      <div className="flex-1 min-h-[250px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      {/* Stats Footer */}
      {data && data.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 pt-4 border-t border-contrast/5 mt-2">
          {data.slice(0, 4).map((d, i) => (
            <div
              key={d.status}
              className="flex flex-col items-center min-w-[80px]"
            >
              <span
                className="text-2xl font-extrabold tracking-tight tabular-nums"
                style={{ color: chartColors[i % chartColors.length] }}
              >
                {d.count}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: chartColors[i % chartColors.length],
                  }}
                />
                <span className="text-sm text-inactive-tab-text font-medium capitalize">
                  {String(d.status).toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/*Global Graduation Year Chart */

const GlobalGraduationYearChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersGraduationYearStats();

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];
    return [...data.distribution].sort(
      (a, b) => a.graduationYear - b.graduationYear,
    );
  }, [data]);

  const option = {
    tooltip: { trigger: "axis", ...tooltipStyle },
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.graduationYear),
      axisLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } },
      axisTick: { show: false },
      axisLabel: { color: colors.contrast, fontSize: 12 },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "rgba(0,0,0,0.05)" } },
      axisLabel: { color: colors.contrast, fontSize: 12 },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "8%",
      containLabel: true,
    },
    series: [
      {
        data: chartData.map((d) => d.count),
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.secondary },
              { offset: 1, color: "rgba(41,94,126,0.15)" },
            ],
          },
          borderRadius: [6, 6, 0, 0],
        },
        barMaxWidth: 32,
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0,0,0,0.12)",
          },
        },
      },
    ],
  };

  if (isLoading) return <CardSkeleton variant="bar" />;

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm">
      <h3 className="text-lg font-semibold text-contrast tracking-tight mb-4">
        Graduation Years
      </h3>
      <ReactECharts
        option={option}
        style={{ height: "250px", width: "100%" }}
      />
    </div>
  );
};

/*Global Universities Chart */

const GlobalUniversitiesChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersUniversitiesStats();

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];
    return [...data.distribution].sort((a, b) => a.count - b.count);
  }, [data]);

  const option = {
    tooltip: { trigger: "axis", ...tooltipStyle },
    xAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "rgba(0,0,0,0.05)" } },
      axisLabel: { color: colors.contrast, fontSize: 12 },
    },
    yAxis: {
      type: "category",
      data: chartData.map((d) => d.university),
      axisLabel: {
        width: 100,
        overflow: "truncate",
        color: colors.contrast,
        fontSize: 12,
      },
      axisLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } },
      axisTick: { show: false },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "4%",
      containLabel: true,
    },
    series: [
      {
        data: chartData.map((d) => d.count),
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "rgba(205,58,56,0.15)" },
              { offset: 1, color: colors.primary },
            ],
          },
          borderRadius: [0, 6, 6, 0],
        },
        barMaxWidth: 24,
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0,0,0,0.12)",
          },
        },
      },
    ],
  };

  if (isLoading) return <CardSkeleton variant="bar" />;

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm">
      <h3 className="text-lg font-semibold text-contrast tracking-tight mb-4">
        Universities
      </h3>
      <ReactECharts
        option={option}
        style={{ height: "250px", width: "100%" }}
      />
    </div>
  );
};

/*Overview Wrapper */

const GlobalStatsOverview: React.FC = () => {
  const colors = useThemeColors();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <GlobalGenderChart colors={colors} />
      <GlobalStatusChart colors={colors} />
      <GlobalGraduationYearChart colors={colors} />
      <GlobalUniversitiesChart colors={colors} />
    </div>
  );
};

export default GlobalStatsOverview;
