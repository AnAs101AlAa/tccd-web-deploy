import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import DepartmentList from "@/constants/departmentList";
import UniversityList from "@/constants/universityList";
import { FiChevronDown } from "react-icons/fi";

const DepartmentAttendanceChart: React.FC = () => {
  const colors = useThemeColors();
  const [selectedUniversity, setSelectedUniversity] = useState<string>("All");

  // Consistent Mock Generator
  const getMockValues = (deptIndex: number, univFilter: string) => {
    // Pseudo-random based on index and filter to stay consistent on re-renders unless filter changes
    const seed =
      deptIndex + (univFilter === "All" ? 100 : univFilter.length * 10);
    return {
      attended: ((seed * 13) % 100) + 20,
      noShow: ((seed * 7) % 30) + 5,
    };
  };

  const chartData = useMemo(() => {
    return DepartmentList.map((dept, idx) => {
      const { attended, noShow } = getMockValues(idx, selectedUniversity);
      return { name: dept, attended, noShow };
    });
  }, [selectedUniversity]);

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
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "#f3f4f6" } },
    },
    yAxis: {
      type: "category",
      data: chartData.map((d) => d.name).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: colors.contrast,
        width: 160,
        overflow: "truncate",
        interval: 0,
      },
    },
    series: [
      {
        name: "Attended",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        itemStyle: { color: colors.secondary },
        data: chartData.map((d) => d.attended).reverse(),
        barWidth: 15,
      },
      {
        name: "No Show",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        itemStyle: {
          color: colors.primary,
          borderRadius: [0, 4, 4, 0], // Rounded right side
        },
        data: chartData.map((d) => d.noShow).reverse(),
        barWidth: 15,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted-primary/20 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-contrast">
          Department Analysis
        </h3>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="appearance-none bg-background-primary/50 text-contrast text-sm font-medium py-2 pl-4 pr-10 rounded-lg border border-muted-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[200px]"
          >
            <option value="All">All Universities</option>
            {UniversityList.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-secondary">
            <FiChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 h-[600px] overflow-y-auto custom-scrollbar">
        {/* Fixed large height for scrollable chart */}
        <ReactECharts
          option={option}
          style={{ height: "1000px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default DepartmentAttendanceChart;
