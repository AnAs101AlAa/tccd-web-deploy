import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useGetEventOverviewStats } from "@/shared/queries/admin/stats/statsQueries";

interface RegistrationOverviewChartProps {
  eventId: string;
}

const RegistrationOverviewChart: React.FC<RegistrationOverviewChartProps> = ({ eventId }) => {
  const colors = useThemeColors();
  const { data, isLoading, error } = useGetEventOverviewStats(eventId);

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
        <p className="text-muted-foreground">Failed to load registration overview.</p>
      </div>
    );
  }

  const attendanceRate = data.attendanceRate || 0;
  const totalRegistered = data.totalRegistered || 0;
  const attendedCount = data.totalAttended || 0;
  const noShowCount = data.totalNoShow || 0;

  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
      left: "center",
      textStyle: {
        color: "#9ca3af",
      },
    },
    series: [
      {
        name: "Attendance",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: colors.background,
          borderWidth: 2,
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
          scale: false,
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
        ],
      },
    ],
  };

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm flex flex-col items-center h-full">
      <h3 className="text-lg font-semibold text-contrast self-start mb-4">
        Attendance Overview
      </h3>
      <div className="w-full h-[250px] relative">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="block text-3xl font-bold text-contrast">
              {attendanceRate.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Attendance
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full mt-4 px-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-contrast">{totalRegistered}</p>
          <p className="text-xs text-muted-foreground">Total Registered</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">{attendedCount}</p>
          <p className="text-xs text-secondary">Attended</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{noShowCount}</p>
          <p className="text-xs text-primary">No Show</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationOverviewChart;
