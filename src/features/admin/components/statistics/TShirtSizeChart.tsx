import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

const TShirtSizeChart: React.FC = () => {
  const colors = useThemeColors();

  const sizes = ["S", "M", "L", "XL", "XXL", "3XL"];
  const values = [150, 400, 450, 250, 80, 20];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: sizes,
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
        name: "Count",
        type: "bar",
        data: values,
        itemStyle: {
          color: colors.secondary,
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: "40%",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-contrast mb-4">
        T-Shirt Size Distribution
      </h3>
      <div className="flex-1 min-h-[250px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default TShirtSizeChart;
