import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useGetEventOverviewStats } from "@/shared/queries/admin/stats/statsQueries";

interface RegistrationOverviewChartProps {
  eventId: string;
}

/*Shared Tooltip Style */

const tooltipStyle = {
  extraCssText:
    "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.10); padding: 12px 16px; color: #1f2937;",
  textStyle: { color: "#374151", fontSize: 13 },
};

/*Skeleton */

const DonutSkeleton = () => (
  <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center h-full animate-pulse">
    <div className="h-5 w-44 bg-contrast/10 rounded-lg self-start mb-6" />
    <div className="flex items-center justify-center h-[250px]">
      <div className="w-40 h-40 rounded-full bg-contrast/8 border-[6px] border-contrast/5 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-background/80" />
        </div>
      </div>
    </div>
    <div className="flex justify-between w-full mt-6 px-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="h-6 w-10 bg-contrast/10 rounded-md" />
          <div className="h-3 w-16 bg-contrast/5 rounded" />
        </div>
      ))}
    </div>
  </div>
);

/*Main Component*/

const RegistrationOverviewChart: React.FC<RegistrationOverviewChartProps> = ({
  eventId,
}) => {
  const colors = useThemeColors();
  const { data, isLoading, error } = useGetEventOverviewStats(eventId);

  if (isLoading) {
    return <DonutSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
        <p className="text-inactive-tab-text">
          Failed to load registration overview.
        </p>
      </div>
    );
  }

  const attendanceRate = data.attendanceRate || 0;
  const totalRegistered = data.totalRegistered || 0;
  const attendedCount = data.totalAttended || 0;
  const noShowCount = data.totalNoShow || 0;
  const cancelledCount = data.totalCancelled || 0;
  const capacity = data.capacity || 0;

  const cancelledColor = "#f59e0b";

  const option = {
    tooltip: {
      trigger: "item",
      ...tooltipStyle,
    },
    legend: {
      bottom: "0%",
      left: "center",
      textStyle: {
        color: "#9ca3af",
        fontSize: 12,
      },
      itemGap: 20,
    },
    series: [
      {
        name: "Attendance",
        type: "pie",
        radius: ["42%", "72%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: colors.background,
          borderWidth: 3,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
            color: colors.contrast,
          },
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: "rgba(0,0,0,0.15)",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: attendedCount,
            name: "Attended",
            itemStyle: { color: colors.secondary },
            label: { show: false },
            emphasis: { label: { show: false } },
          },
          {
            value: noShowCount,
            name: "No Show",
            itemStyle: { color: colors.primary },
            label: { show: false },
            emphasis: { label: { show: false } },
          },
          {
            value: cancelledCount,
            name: "Cancelled",
            itemStyle: { color: cancelledColor },
            label: { show: false },
            emphasis: { label: { show: false } },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center h-full">
      <h3 className="text-lg font-semibold text-contrast self-start mb-4 tracking-tight">
        Attendance Overview
      </h3>
      <div className="w-full h-[250px] relative">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="block text-3xl font-extrabold text-contrast tracking-tight tabular-nums">
              {attendanceRate.toFixed(1)}%
            </span>
            <span className="text-[11px] text-inactive-tab-text uppercase tracking-widest font-semibold">
              Attendance
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-around w-full mt-5 px-2 gap-y-3 border-t border-contrast/5 pt-5">
        <div className="text-center min-w-[60px]">
          <p className="text-2xl font-extrabold text-contrast tracking-tight tabular-nums">
            {capacity}
          </p>
          <p className="text-xs text-inactive-tab-text font-medium mt-1">
            Capacity
          </p>
        </div>
        <div className="text-center min-w-[60px]">
          <p className="text-2xl font-extrabold text-contrast tracking-tight tabular-nums">
            {totalRegistered}
          </p>
          <p className="text-xs text-inactive-tab-text font-medium mt-1">
            Registered
          </p>
        </div>
        <div className="text-center min-w-[60px]">
          <p className="text-2xl font-extrabold text-secondary tracking-tight tabular-nums">
            {attendedCount}
          </p>
          <p className="text-xs text-secondary font-medium mt-1">Attended</p>
        </div>
        <div className="text-center min-w-[60px]">
          <p className="text-2xl font-extrabold text-primary tracking-tight tabular-nums">
            {noShowCount}
          </p>
          <p className="text-xs text-primary font-medium mt-1">No Show</p>
        </div>
        <div className="text-center min-w-[60px]">
          <p
            className="text-2xl font-extrabold tracking-tight tabular-nums"
            style={{ color: cancelledColor }}
          >
            {cancelledCount}
          </p>
          <p
            className="text-xs font-medium mt-1"
            style={{ color: cancelledColor }}
          >
            Cancelled
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationOverviewChart;
