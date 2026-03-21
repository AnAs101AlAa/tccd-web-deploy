import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { FiChevronDown } from "react-icons/fi";
import { useGetEventDepartmentAttendanceStats } from "@/shared/queries/admin/stats/statsQueries";
import UniversityList from "@/constants/universityList";

interface DepartmentAttendanceChartProps {
  eventId: string;
}

const DepartmentAttendanceChart: React.FC<DepartmentAttendanceChartProps> = ({ eventId }) => {
  const colors = useThemeColors();
  const [selectedUniversity, setSelectedUniversity] = useState<string>("All");

  // Fetch only with specific university if not "All"
  const fetchUniversity = selectedUniversity === "All" ? undefined : selectedUniversity;
  
  const { data, isLoading, error } = useGetEventDepartmentAttendanceStats(
    eventId,
    fetchUniversity
  );

  const chartData = useMemo(() => {
    if (!data || !data.departments) return [];
    
    return [...data.departments]
      .map(dept => ({
        name: dept.department,
        attended: dept.attended,
        noShow: dept.noShow,
        total: dept.attended + dept.noShow
      }))
      .sort((a, b) => b.total - a.total); // Sort by total attendance
  }, [data]);


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
          borderRadius: [0, 4, 4, 0] as number[], // Rounded right side
        },
        data: chartData.map((d) => d.noShow).reverse(),
        barWidth: 15,
      },
    ],
  };

  const chartHeight = Math.max(600, chartData.length * 40);

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col">
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

      <div className="flex-1 h-[600px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contrast"></div>
          </div>
        ) : error || !data ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Failed to load department attendance.
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            No data available.
          </div>
        ) : (
          <ReactECharts
            option={option}
            style={{ height: `${chartHeight}px`, width: "100%" }}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentAttendanceChart;
