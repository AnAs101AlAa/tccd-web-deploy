import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

const GenderDistributionChart: React.FC = () => {
  const colors = useThemeColors();

  const data = [
    { value: 735, name: "Male" },
    { value: 580, name: "Female" },
  ];

  const option = {
    color: [colors.secondary, colors.primary],
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Gender",
        type: "pie",
        radius: "70%",
        center: ["50%", "55%"],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        itemStyle: {
          borderWidth: 2,
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
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-contrast mb-2">
        Gender Distribution
      </h3>
      <div className="flex-1 min-h-[200px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      {/* Custom Stats Footer */}
      <div className="flex justify-around items-center pt-4 border-t border-muted-primary/10 mt-2">
        <div className="flex flex-col items-center">
          <span
            className="text-3xl font-bold"
            style={{ color: colors.secondary }}
          >
            {data[0].value}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.secondary }}
            />
            <span className="text-sm text-gray-500 font-medium">Male</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span
            className="text-3xl font-bold"
            style={{ color: colors.primary }}
          >
            {data[1].value}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-sm text-gray-500 font-medium">Female</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderDistributionChart;
