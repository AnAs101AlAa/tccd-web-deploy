import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import UniversityList from "@/constants/universityList";

const UniversityDistributionChart: React.FC = () => {
  const colors = useThemeColors();

  const data = useMemo(() => {
    return UniversityList.map((uni) => ({
      name: uni,
      // Mock random consistent value for demo
      value: Math.floor(Math.random() * 400) + 50,
    })).sort((a, b) => b.value - a.value);
  }, []);

  const option = {
    grid: {
      top: "5%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
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
        interval: 0,
        width: 140,
        overflow: "truncate",
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
              { offset: 0, color: colors.mutedPrimary },
              { offset: 1, color: colors.primary },
            ],
          },
          borderRadius: [0, 4, 4, 0],
        },
        barWidth: 20,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold text-contrast mb-4">
        University Distribution
      </h3>
      <div className="flex-1 h-[600px] overflow-y-auto">
        <ReactECharts
          option={option}
          style={{ height: "800px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default UniversityDistributionChart;
