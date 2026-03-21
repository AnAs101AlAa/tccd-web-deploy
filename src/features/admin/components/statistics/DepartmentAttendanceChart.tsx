import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { FiChevronDown } from "react-icons/fi";
import { useGetEventDepartmentAttendanceStats } from "@/shared/queries/admin/stats/statsQueries";
import DepartmentList from "@/constants/departmentList";


interface DepartmentAttendanceChartProps {
  eventId: string;
}

const DepartmentAttendanceChart: React.FC<DepartmentAttendanceChartProps> = ({ eventId }) => {
  const colors = useThemeColors();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  const { data, isLoading, error } = useGetEventDepartmentAttendanceStats(eventId);

  const chartData = useMemo(() => {
    if (!data || !data.departments) return [];
    
    const query = selectedDepartment.trim().toLowerCase();
    
    const filteredDepts = selectedDepartment === "All" 
      ? data.departments 
      : data.departments.filter(dept => 
          dept.department.trim().toLowerCase() === query ||
          dept.department.trim().toLowerCase().includes(query) ||
          query.includes(dept.department.trim().toLowerCase())
        );

    return [...filteredDepts]
      .map(dept => ({
        name: dept.department,
        attended: dept.attended,
        noShow: dept.noShow,
        total: dept.attended + dept.noShow
      }))
      .sort((a, b) => b.total - a.total); // Sort by total attendance descending
  }, [data, selectedDepartment]);

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
      bottom: "15%", // Space for dataZoom and rotated labels
      top: "12%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: chartData.length > 8 ? 40 : 100, // Show 40% if many items, else 100%
        bottom: 0,
        height: 20,
        borderColor: "transparent",
        fillerColor: "rgba(107, 114, 128, 0.2)", // gray-500 with opacity
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
        rotate: 30, // Rotate labels to fit more
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
        name: "Attended",
        type: "bar",
        emphasis: { focus: "series" },
        itemStyle: { 
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors.secondary },
              { offset: 1, color: "rgba(156, 163, 175, 0.2)" }, // Fade out to bottom
            ],
          },
          borderRadius: [4, 4, 0, 0] as number[] 
        },
        data: chartData.map((d) => d.attended),
        barMaxWidth: 30,
      },
      {
        name: "No Show",
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
          borderRadius: [4, 4, 0, 0] as number[],
        },
        data: chartData.map((d) => d.noShow),
        barMaxWidth: 30,
      },
    ],
  };

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-contrast">
          Department Analysis
        </h3>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none bg-background-primary/50 text-contrast text-sm font-medium py-2 pl-4 pr-10 rounded-lg border border-muted-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[200px]"
          >
            <option value="All">All Departments</option>
            {DepartmentList.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-secondary">
            <FiChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
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
            style={{ height: "100%", width: "100%" }}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentAttendanceChart;
