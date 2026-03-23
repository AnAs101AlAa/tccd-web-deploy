import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useGetEventGenderDistributionStats } from "@/shared/queries/admin/stats/statsQueries";

interface GenderDistributionChartProps {
  eventId: string;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({ eventId }) => {
  const colors = useThemeColors();
  const { data, isLoading, error } = useGetEventGenderDistributionStats(eventId);

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];
    
    const males = data.distribution.find(d => String(d.gender).toLowerCase() === 'male' || String(d.gender) === '0')?.count || 0;
    const females = data.distribution.find(d => String(d.gender).toLowerCase() === 'female' || String(d.gender) === '1')?.count || 0;

    return [
      { value: males, name: "Male" },
      { value: females, name: "Female" },
    ];
  }, [data]);

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
        <p className="text-muted-foreground">Failed to load gender distribution.</p>
      </div>
    );
  }

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
        data: chartData,
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
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col justify-between">
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
            {chartData[0]?.value || 0}
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
            {chartData[1]?.value || 0}
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
