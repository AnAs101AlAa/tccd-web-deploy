import React from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

const TicketTypeChart: React.FC = () => {
  const colors = useThemeColors();

  const data = [
    { value: 800, name: "Student" },
    { value: 150, name: "Professional" },
    { value: 50, name: "VIP" },
    { value: 48, name: "Speaker" },
  ];

  const option = {
    color: [
      colors.primary,
      colors.secondary,
      colors.mutedPrimary,
      colors.contrast,
    ],
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
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
        name: "Ticket Type",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: colors.background,
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            color: colors.contrast,
          },
        },
        data: data,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-contrast mb-4">
        Ticket Type Distribution
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

export default TicketTypeChart;
