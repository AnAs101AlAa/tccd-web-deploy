import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { FiChevronDown } from "react-icons/fi";
import { useGetEventUniversityDistributionStats } from "@/shared/queries/admin/stats/statsQueries";
import UniversityList from "@/constants/universityList";

interface UniversityDistributionChartProps {
  eventId: string;
}

const UniversityDistributionChart: React.FC<UniversityDistributionChartProps> = ({ eventId }) => {
  const colors = useThemeColors();
  const [selectedUniversity, setSelectedUniversity] = useState<string>("All");
  const { data, isLoading, error } = useGetEventUniversityDistributionStats(eventId);

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];
    
    const query = selectedUniversity.trim().toLowerCase();
    
    const filteredUnivs = selectedUniversity === "All"
      ? data.distribution
      : data.distribution.filter(u => 
          u.university.trim().toLowerCase() === query ||
          u.university.trim().toLowerCase().includes(query) ||
          query.includes(u.university.trim().toLowerCase())
        );

    return [...filteredUnivs]
      .map(item => ({
        name: item.university,
        value: item.count
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, selectedUniversity]);

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
        <p className="text-muted-foreground">Failed to load university distribution.</p>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: "#6b7280" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: "12%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: chartData.length > 8 ? 40 : 100,
        bottom: 0,
        height: 20,
        borderColor: "transparent",
        fillerColor: "rgba(107, 114, 128, 0.2)",
      },
      {
        type: "inside",
        xAxisIndex: [0],
      }
    ],
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.name),
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisTick: { show: false },
      axisLabel: {
        color: colors.contrast,
        interval: 0,
        rotate: 30,
        width: 100,
        overflow: "truncate",
      },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "#f3f4f6" } },
      axisLabel: {
        color: colors.contrast,
      },
    },
    series: [
      {
        name: "Attendees",
        type: "bar",
        emphasis: { focus: "series" },
        itemStyle: { 
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors.primary },
              { offset: 1, color: "rgba(156, 163, 175, 0.2)" },
            ],
          },
          borderRadius: [4, 4, 0, 0] as number[] 
        },
        data: chartData.map((d) => d.value),
        barMaxWidth: 30,
      },
    ],
  };

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-contrast">
          University Distribution
        </h3>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="appearance-none bg-background-primary/50 text-contrast text-sm font-medium py-2 pl-4 pr-10 rounded-lg border border-muted-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[200px]"
          >
            <option value="All">All Universities</option>
            {UniversityList.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-secondary">
            <FiChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default UniversityDistributionChart;
