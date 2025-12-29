import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

const UniversityDistributionChart: React.FC = () => {
  const colors = useThemeColors();

  const data = [
    { name: "Cairo University", value: 450 },
    { name: "Ain Shams University", value: 380 },
    { name: "Helwan University", value: 210 },
    { name: "AUC", value: 150 },
    { name: "GUC", value: 120 },
  ];

  const option = {
    grid: {
      top: "10%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: { type: "dashed", color: "#f3f4f6" },
      },
    },
    yAxis: {
      type: "category",
      data: data.map((item) => item.name).reverse(),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: colors.contrast,
        fontWeight: 500,
      },
    },
    series: [
      {
        name: "Attendees",
        type: "bar",
        data: data.map((item) => item.value).reverse(),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: colors.mutedPrimary }, // light primary
              { offset: 1, color: colors.primary }, // primary
            ],
          },
          borderRadius: [0, 4, 4, 0],
        },
        barWidth: 20,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-contrast mb-4">
        Top 5 Universities
      </h3>
      <ReactECharts
        option={option}
        style={{ height: "350px", width: "100%" }}
      />
    </div>
  );
};

export default UniversityDistributionChart;
