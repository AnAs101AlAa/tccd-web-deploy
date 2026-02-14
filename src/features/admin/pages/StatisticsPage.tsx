import React, { useState } from "react";
import { motion } from "framer-motion";
import { WithLayout } from "@/shared/components/hoc";
import RegistrationOverviewChart from "../components/statistics/RegistrationOverviewChart";
import GenderDistributionChart from "../components/statistics/GenderDistributionChart";
import UniversityDistributionChart from "../components/statistics/UniversityDistributionChart";
import DepartmentAttendanceChart from "../components/statistics/DepartmentAttendanceChart";
import EventsStatisticsTable from "../components/statistics/EventsStatisticsTable";
import { IoArrowBack } from "react-icons/io5";
import type Event from "@/shared/types/events";

const StatisticsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <WithLayout>
      <div className="py-4 md:py-8 px-4 md:px-8">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[29px] md:text-[32px] lg:text-[34px] font-bold text-contrast">
              Event Statistics
            </h1>
            <p className="text-inactive-tab-text text-[15px] md:text-[16px] lg:text-[18px]">
              Comprehensive insights into registration, attendance, and student
              feedback
            </p>
          </div>
        </div>

        {/* Content: Table or Charts */}
        {!selectedEvent ? (
          <section className="rounded-xl border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm">
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-secondary">
                  All Events
                </h2>
                <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                  Select an event to view its detailed statistics
                </p>
              </div>
              <hr className="border-t border-gray-400/60 -mt-1 mb-1 shadow-lg" />
            </div>

            <EventsStatisticsTable onEventSelect={setSelectedEvent} />
          </section>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Back Button + Event Info */}
            <section className="rounded-xl border border-contrast/10 bg-background/60 p-4 sm:p-5 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-contrast/10 hover:bg-contrast/20 text-contrast font-medium transition-colors text-sm"
                >
                  <IoArrowBack className="text-lg" />
                  Back to Events
                </button>
                <div className="ml-2">
                  <h2 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-contrast">
                    {selectedEvent.name}
                  </h2>
                  <p className="text-[14px] md:text-[15px] text-inactive-tab-text">
                    {selectedEvent.type} •{" "}
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RegistrationOverviewChart />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <GenderDistributionChart />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="md:col-span-2 min-h-[400px]"
              >
                <UniversityDistributionChart />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="md:col-span-2 min-h-[450px]"
              >
                <DepartmentAttendanceChart />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </WithLayout>
  );
};

export default StatisticsPage;
