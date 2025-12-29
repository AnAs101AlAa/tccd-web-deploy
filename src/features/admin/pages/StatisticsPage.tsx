import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WithSidebar from "@/shared/components/hoc/WithSidebar";
import RegistrationOverviewChart from "../components/statistics/RegistrationOverviewChart";
import GenderDistributionChart from "../components/statistics/GenderDistributionChart";
import UniversityDistributionChart from "../components/statistics/UniversityDistributionChart";
import DepartmentAttendanceChart from "../components/statistics/DepartmentAttendanceChart";
import FeedbackCarousel from "../components/statistics/FeedbackCarousel";
import TicketTypeChart from "../components/statistics/TicketTypeChart";
import RegistrationTrendChart from "../components/statistics/RegistrationTrendChart";
import TShirtSizeChart from "../components/statistics/TShirtSizeChart";

const StatisticsPage: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <WithSidebar>
      <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-contrast tracking-tight">
            TCCD Annual Tech Summit Analysis
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into registration, attendance, and student
            feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            transition={{ duration: 0.3, delay: 0.2 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <FeedbackCarousel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-2 min-h-[400px]"
          >
            <UniversityDistributionChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="md:col-span-2 lg:col-span-3 min-h-[450px]"
          >
            <DepartmentAttendanceChart />
          </motion.div>
        </div>

        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
            >
              <div className="md:col-span-1">
                <TicketTypeChart />
              </div>
              <div className="md:col-span-2">
                <RegistrationTrendChart />
              </div>
              <div className="md:col-span-3 lg:col-span-3">
                <TShirtSizeChart />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-contrast text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:bg-contrast/90 transition-all duration-300 transform hover:-translate-y-1"
          >
            {showAll ? "Show Less" : "View All Analytics"}
          </button>
        </div>
      </div>
    </WithSidebar>
  );
};

export default StatisticsPage;
