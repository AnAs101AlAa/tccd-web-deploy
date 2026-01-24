import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

const RegistrationTrendChart: React.FC = () => {
  const colors = useThemeColors();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = [120, 132, 101, 134, 90, 230, 210];

  const option = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: days,
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: { color: "#6b7280" },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "#f3f4f6" } },
      axisLabel: { color: "#6b7280" },
    },
    series: [
      {
        name: "Registrations",
        type: "line",
        smooth: true,
        lineStyle: {
          color: colors.primary,
          width: 3,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.primary },
              { offset: 1, color: "rgba(255, 255, 255, 0)" },
            ],
          },
          opacity: 0.3,
        },
        itemStyle: {
          color: colors.primary,
          borderWidth: 2,
          borderColor: "#fff",
        },
        data: counts,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-contrast mb-4">
        Registration Trends (Last 7 Days)
      </h3>
      <div className="flex-1 min-h-[300px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default RegistrationTrendChart;
