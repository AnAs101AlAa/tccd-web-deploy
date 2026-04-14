import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useGetEventDepartmentAttendanceStats } from "@/shared/queries/admin/stats/statsQueries";
import DepartmentList from "@/constants/departmentList";
import { DropdownMenu } from "tccd-ui";

interface DepartmentAttendanceChartProps {
  eventId: string;
}

/*Shared Tooltip Style */

const tooltipStyle = {
  extraCssText:
    "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: rgba(255,255,255,0.88); border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.10); padding: 12px 16px; color: #1f2937;",
  textStyle: { color: "#374151", fontSize: 13 },
};

/*Skeleton Loader */
const BarChartSkeleton = () => (
  <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="h-5 w-44 bg-contrast/10 rounded-lg" />
      <div className="h-10 w-52 bg-contrast/8 rounded-lg" />
    </div>
    <div className="flex-1 min-h-[340px] flex items-end justify-around gap-3 pb-8 px-4">
      {[50, 80, 35, 65, 90, 45, 70, 55].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-contrast/8 rounded-t-lg"
            style={{ height: `${h}%` }}
          />
          <div className="h-3 w-10 bg-contrast/5 rounded" />
        </div>
      ))}
    </div>
  </div>
);

/*Dropdown Options */

const departmentOptions = [
  { value: "All", label: "All Departments" },
  ...DepartmentList.map((d) => ({ value: d, label: d })),
];

/*Main Component*/

const DepartmentAttendanceChart: React.FC<DepartmentAttendanceChartProps> = ({
  eventId,
}) => {
  const colors = useThemeColors();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  const { data, isLoading, error } =
    useGetEventDepartmentAttendanceStats(eventId);

  const chartData = useMemo(() => {
    if (!data || !data.departments) return [];

    const query = selectedDepartment.trim().toLowerCase();

    const filteredDepts =
      selectedDepartment === "All"
        ? data.departments
        : data.departments.filter(
            (dept) =>
              dept.department.trim().toLowerCase() === query ||
              dept.department.trim().toLowerCase().includes(query) ||
              query.includes(dept.department.trim().toLowerCase()),
          );

    return [...filteredDepts]
      .map((dept) => ({
        name: dept.department,
        attended: dept.attended,
        noShow: dept.noShow,
        total: dept.attended + dept.noShow,
      }))
      .sort((a, b) => b.total - a.total);
  }, [data, selectedDepartment]);

  const option = {
    tooltip: { trigger: "axis", ...tooltipStyle },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: "#6b7280", fontSize: 12 },
      itemGap: 16,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "0%",
      top: "12%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.map((d) => d.name),
      axisLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } },
      axisTick: { show: false },
      max: chartData.length >= 6 ? undefined : 5,
      axisLabel: {
        color: colors.contrast,
        interval: 0,
        rotate: 30,
        width: 100,
        overflow: "truncate",
        fontSize: 11,
      },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "rgba(0,0,0,0.05)" } },
      axisLabel: {
        color: colors.contrast,
        fontSize: 12,
      },
    },
    series: [
      {
        name: "Attended",
        type: "bar",
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0,0,0,0.12)",
          },
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.secondary },
              { offset: 1, color: "rgba(41,94,126,0.08)" },
            ],
          },
          borderRadius: [6, 6, 0, 0] as number[],
        },
        data: chartData.map((d) => d.attended),
        barMaxWidth: 32,
      },
      {
        name: "No Show",
        type: "bar",
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0,0,0,0.12)",
          },
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.primary },
              { offset: 1, color: "rgba(205,58,56,0.08)" },
            ],
          },
          borderRadius: [6, 6, 0, 0] as number[],
        },
        data: chartData.map((d) => d.noShow),
        barMaxWidth: 32,
      },
    ],
  };

  return (
    <div className="bg-background/60 p-7 sm:p-8 rounded-2xl border border-contrast/10 shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-contrast tracking-tight">
          Department Analysis
        </h3>

        <div className="w-full sm:w-56">
          <DropdownMenu
            placeholder="All Departments"
            options={departmentOptions}
            value={selectedDepartment}
            onChange={(value) => setSelectedDepartment(value)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
        {isLoading ? (
          <BarChartSkeleton />
        ) : error || !data ? (
          <div className="flex justify-center items-center h-full text-inactive-tab-text">
            Failed to load department attendance.
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-full text-inactive-tab-text">
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
