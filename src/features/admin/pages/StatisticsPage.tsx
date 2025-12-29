import React from "react";
import { motion } from "framer-motion";
import WithSidebar from "@/shared/components/hoc/WithSidebar";
import RegistrationOverviewChart from "../components/statistics/RegistrationOverviewChart";
import GenderDistributionChart from "../components/statistics/GenderDistributionChart";
import UniversityDistributionChart from "../components/statistics/UniversityDistributionChart";
import DepartmentAttendanceChart from "../components/statistics/DepartmentAttendanceChart";
import FeedbackCarousel from "../components/statistics/FeedbackCarousel";

const StatisticsPage: React.FC = () => {
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

          {/* Row 2: University & Department - Larger Charts */}
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
            transition={{ duration: 0.3, delay: 0.4 }}
            className="md:col-span-2 lg:col-span-1 min-h-[400px]"
          >
            {/* Placeholder or another chart, for now extending Dept chart width might be better or keeping it here */}
            {/* Actually, user asked for top 5 universities, and Dept vs No Show. Let's put Dept in full width below if complex, or here. */}
            {/* Let's put Department Chart here but maybe make it span more if needed. */}
            {/* Let's swap: University Distribution is big. Department is also big. */}
            {/* Let's make Department Chart span full width or 2 cols */}
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

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <button className="px-8 py-3 bg-contrast text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:bg-contrast/90 transition-all duration-300 transform hover:-translate-y-1">
            View All Analytics
          </button>
        </div>
      </div>
    </WithSidebar>
  );
};

export default StatisticsPage;
