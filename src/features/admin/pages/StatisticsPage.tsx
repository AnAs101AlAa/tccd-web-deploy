import React, { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WithLayout } from "@/shared/components/hoc";
import EventsStatisticsTable from "../components/statistics/EventsStatisticsTable";
import { IoArrowBack } from "react-icons/io5";
import format from "@/shared/utils/dateFormater";

const RegistrationOverviewChart = lazy(
  () => import("../components/statistics/RegistrationOverviewChart"),
);
const GenderDistributionChart = lazy(
  () => import("../components/statistics/GenderDistributionChart"),
);
const UniversityDistributionChart = lazy(
  () => import("../components/statistics/UniversityDistributionChart"),
);
const DepartmentAttendanceChart = lazy(
  () => import("../components/statistics/DepartmentAttendanceChart"),
);
const GlobalStatsOverview = lazy(
  () => import("../components/statistics/GlobalStatsOverview"),
);

import type Event from "@/shared/types/events";

/*Skeleton Fallbacks */

const GlobalStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-background/60 p-7 rounded-2xl border border-contrast/10 shadow-sm flex flex-col gap-4 animate-pulse"
      >
        <div className="h-5 w-36 bg-contrast/10 rounded-lg" />
        <div className="flex-1 min-h-[220px] flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-contrast/8 border-[6px] border-contrast/5" />
        </div>
        <div className="border-t border-contrast/5 pt-4 flex justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className="h-7 w-12 bg-contrast/10 rounded-md" />
            <div className="h-3 w-14 bg-contrast/5 rounded" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-7 w-12 bg-contrast/10 rounded-md" />
            <div className="h-3 w-14 bg-contrast/5 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ChartGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Donut chart skeleton */}
    <div className="bg-background/60 p-7 rounded-2xl border border-contrast/10 shadow-sm animate-pulse">
      <div className="h-5 w-44 bg-contrast/10 rounded-lg mb-6" />
      <div className="flex items-center justify-center h-[250px]">
        <div className="w-40 h-40 rounded-full bg-contrast/8 border-[6px] border-contrast/5" />
      </div>
      <div className="flex justify-between mt-6 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-6 w-10 bg-contrast/10 rounded-md" />
            <div className="h-3 w-16 bg-contrast/5 rounded" />
          </div>
        ))}
      </div>
    </div>
    {/* Pie chart skeleton */}
    <div className="bg-background/60 p-7 rounded-2xl border border-contrast/10 shadow-sm animate-pulse">
      <div className="h-5 w-40 bg-contrast/10 rounded-lg mb-6" />
      <div className="flex items-center justify-center h-[220px]">
        <div className="w-36 h-36 rounded-full bg-contrast/8 border-[6px] border-contrast/5" />
      </div>
      <div className="border-t border-contrast/5 pt-4 mt-4 flex justify-around">
        <div className="flex flex-col items-center gap-2">
          <div className="h-7 w-12 bg-contrast/10 rounded-md" />
          <div className="h-3 w-14 bg-contrast/5 rounded" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-7 w-12 bg-contrast/10 rounded-md" />
          <div className="h-3 w-14 bg-contrast/5 rounded" />
        </div>
      </div>
    </div>
    {/* Full-width bar chart skeleton */}
    <div className="md:col-span-2 bg-background/60 p-7 rounded-2xl border border-contrast/10 shadow-sm min-h-[400px] animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-5 w-44 bg-contrast/10 rounded-lg" />
        <div className="h-9 w-48 bg-contrast/8 rounded-lg" />
      </div>
      <div className="flex items-end justify-around h-[300px] pt-8 gap-3">
        {[65, 85, 45, 70, 55, 90, 40, 75].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-contrast/8 rounded-t-md"
              style={{ height: `${h}%` }}
            />
            <div className="h-3 w-10 bg-contrast/5 rounded" />
          </div>
        ))}
      </div>
    </div>
    {/* Full-width bar chart skeleton 2 */}
    <div className="md:col-span-2 bg-background/60 p-7 rounded-2xl border border-contrast/10 shadow-sm min-h-[450px] animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-5 w-44 bg-contrast/10 rounded-lg" />
        <div className="h-9 w-48 bg-contrast/8 rounded-lg" />
      </div>
      <div className="flex items-end justify-around h-[340px] pt-8 gap-3">
        {[50, 80, 35, 65, 90, 45, 70, 55].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-contrast/8 rounded-t-md"
              style={{ height: `${h}%` }}
            />
            <div className="h-3 w-10 bg-contrast/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const viewTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
};

const chartStagger = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] as const },
});

const StatisticsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <WithLayout>
      <div className="py-4 md:py-8 px-4 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[29px] md:text-[32px] lg:text-[34px] font-bold text-contrast tracking-tight">
              Event Statistics
            </h1>
            <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
              Comprehensive insights into registration, attendance, and student
              feedback
            </p>
          </div>
        </div>

        {/* Content: Animated view transition */}
        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div
              key="global-view"
              {...viewTransition}
              className="space-y-8"
            >
              <Suspense fallback={<GlobalStatsSkeleton />}>
                <GlobalStatsOverview />
              </Suspense>

              <section className="rounded-2xl border border-contrast/10 bg-background/60 p-5 sm:p-6 lg:p-7 shadow-sm">
                <div className="flex flex-col gap-3 mb-5">
                  <div>
                    <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary tracking-tight">
                      All Events
                    </h2>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                      Select an event to view its detailed statistics
                    </p>
                  </div>
                  <hr className="border-t border-contrast/10 -mt-1 mb-1" />
                </div>

                <EventsStatisticsTable onEventSelect={setSelectedEvent} />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="event-detail-view"
              {...viewTransition}
              className="flex flex-col gap-6"
            >
              {/* Back Button + Event Info */}
              <section className="rounded-2xl border border-contrast/10 bg-background/60 p-5 sm:p-6 lg:p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-contrast/5 hover:bg-contrast/10 text-contrast font-medium transition-all text-sm active:scale-[0.97]"
                  >
                    <IoArrowBack className="text-lg" />
                    Back to Events
                  </button>
                  <div className="ml-2">
                    <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-contrast tracking-tight">
                      {selectedEvent.name}
                    </h2>
                    <p className="text-[14px] md:text-[15px] text-inactive-tab-text">
                      {selectedEvent.type} •{" "}
                      {format(selectedEvent.date, "stringed")}
                    </p>
                  </div>
                </div>
              </section>

              {/* Charts Grid */}
              <Suspense fallback={<ChartGridSkeleton />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div {...chartStagger(0)}>
                    <RegistrationOverviewChart eventId={selectedEvent.id} />
                  </motion.div>

                  <motion.div {...chartStagger(0.1)}>
                    <GenderDistributionChart eventId={selectedEvent.id} />
                  </motion.div>

                  <motion.div
                    {...chartStagger(0.25)}
                    className="md:col-span-2 xl:col-span-1 min-h-[400px]"
                  >
                    <UniversityDistributionChart eventId={selectedEvent.id} />
                  </motion.div>

                  <motion.div
                    {...chartStagger(0.4)}
                    className="md:col-span-2 xl:col-span-1 min-h-[450px]"
                  >
                    <DepartmentAttendanceChart eventId={selectedEvent.id} />
                  </motion.div>
                </div>
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WithLayout>
  );
};

export default StatisticsPage;
