import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

const DepartmentAttendanceChart: React.FC = () => {
  const colors = useThemeColors();

  const departments = [
    "CSE",
    "ECE",
    "Mechanical",
    "Architecture",
    "Civil",
    "Biomedical",
  ];
  const attended = [320, 280, 150, 120, 90, 80];
  const noShow = [50, 45, 30, 20, 15, 10];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      top: "bottom",
      textStyle: { color: "#6b7280" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: departments,
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: { color: "#6b7280", interval: 0, rotate: 30 },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "#f3f4f6" } },
    },
    series: [
      {
        name: "Attended",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        itemStyle: { color: colors.success }, 
        data: attended,
      },
      {
        name: "No Show",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        itemStyle: {
          color: colors.error,
          borderRadius: [4, 4, 0, 0], 
        },
        data: noShow,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-contrast mb-4">
        Department Attendance Analysis
      </h3>
      <ReactECharts
        option={option}
        style={{ height: "400px", width: "100%" }}
      />
    </div>
  );
};

export default DepartmentAttendanceChart;
