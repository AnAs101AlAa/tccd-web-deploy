import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

const RegistrationOverviewChart: React.FC = () => {
  const colors = useThemeColors();

  const totalRegistered = 1348;
  const attendanceRate = Math.round((1048 / 1348) * 100);

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
            value: 1048,
            name: "Attended",
            itemStyle: { color: colors.secondary },
            label: { show: false },
            emphasis: { label: { show: false } },
          },
          {
            value: 300,
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
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm flex flex-col items-center">
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
              {attendanceRate}%
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
          <p className="text-2xl font-bold text-secondary">{1048}</p>
          <p className="text-xs text-secondary">Attended</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{300}</p>
          <p className="text-xs text-primary">No Show</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationOverviewChart;
