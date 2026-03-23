import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { 
  useGetUsersGenderStats,
  useGetUsersStatusStats,
  useGetUsersGraduationYearStats,
  useGetUsersUniversitiesStats
} from "@/shared/queries/admin/stats/statsQueries";

const GlobalGenderChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersGenderStats();
  
  const option = {
    color: [colors.secondary, colors.primary],
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: data ? [
          { value: data.males, name: "Male" },
          { value: data.females, name: "Female" }
        ] : [],
        label: { show: false }
      }
    ]
  };

  if (isLoading) return <div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contrast"></div></div>;

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-lg font-semibold text-contrast mb-4">Total Users Gender</h3>
      <div className="flex-1 min-h-[250px]">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </div>

      {/* Custom Stats Footer */}
      {data && (
        <div className="flex justify-around items-center pt-4 border-t border-muted-primary/10 mt-2">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold" style={{ color: colors.secondary }}>
              {data.males}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }} />
              <span className="text-sm text-gray-500 font-medium">Male</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold" style={{ color: colors.primary }}>
              {data.females}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              <span className="text-sm text-gray-500 font-medium">Female</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GlobalStatusChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersStatusStats();

  const option = {
    color: [colors.secondary, colors.primary, colors.mutedPrimary, colors.contrast],
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: data ? data.map(d => ({ name: d.status, value: d.count })) : [],
        label: { show: false }
      }
    ]
  };

  if (isLoading) return <div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contrast"></div></div>;

  const chartColors = [colors.secondary, colors.primary, colors.mutedPrimary, colors.contrast];

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-lg font-semibold text-contrast mb-4">Total Users Status</h3>
      <div className="flex-1 min-h-[250px]">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </div>

      {/* Custom Stats Footer */}
      {data && data.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 pt-4 border-t border-muted-primary/10 mt-2">
          {data.slice(0, 4).map((d, i) => (
            <div key={d.status} className="flex flex-col items-center">
              <span className="text-2xl font-bold" style={{ color: chartColors[i % chartColors.length] }}>
                {d.count}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
                <span className="text-sm text-gray-500 font-medium capitalize">
                  {String(d.status).toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GlobalGraduationYearChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersGraduationYearStats();

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];
    return [...data.distribution].sort((a, b) => a.graduationYear - b.graduationYear);
  }, [data]);

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: chartData.map(d => d.graduationYear) },
    yAxis: { type: "value" },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    series: [
      {
        data: chartData.map(d => d.count),
        type: "bar",
        itemStyle: { color: colors.secondary, borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  if (isLoading) return <div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contrast"></div></div>;

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm">
      <h3 className="text-lg font-semibold text-contrast mb-4">Graduation Years</h3>
      <ReactECharts option={option} style={{ height: "250px", width: "100%" }} />
    </div>
  );
};

const GlobalUniversitiesChart = ({ colors }: { colors: any }) => {
  const { data, isLoading } = useGetUsersUniversitiesStats();

  const chartData = useMemo(() => {
    if (!data || !data.distribution) return [];
    return [...data.distribution].sort((a, b) => a.count - b.count);
  }, [data]);

  const option = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "value" },
    yAxis: { 
      type: "category", 
      data: chartData.map(d => d.university),
      axisLabel: { width: 100, overflow: 'truncate' }
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    series: [
      {
        data: chartData.map(d => d.count),
        type: "bar",
        itemStyle: { color: colors.primary, borderRadius: [0, 4, 4, 0] }
      }
    ]
  };

  if (isLoading) return <div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contrast"></div></div>;

  return (
    <div className="bg-background/60 p-6 rounded-2xl border border-contrast/10 shadow-sm">
      <h3 className="text-lg font-semibold text-contrast mb-4">Universities</h3>
      <ReactECharts option={option} style={{ height: "250px", width: "100%" }} />
    </div>
  );
};

const GlobalStatsOverview: React.FC = () => {
  const colors = useThemeColors();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <GlobalGenderChart colors={colors} />
      <GlobalStatusChart colors={colors} />
      <GlobalGraduationYearChart colors={colors} />
      <GlobalUniversitiesChart colors={colors} />
    </div>
  );
};

export default GlobalStatsOverview;
