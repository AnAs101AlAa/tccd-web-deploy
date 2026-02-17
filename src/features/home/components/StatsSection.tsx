import { StatCard } from "./components/StatCard";
import { useRef } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { STATS_DATA } from "../constants";

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  return (
    <section
      className={`bg-gradient-to-r from-[#295E7E] via-[#2B4C5E] to-[#cd3a38] py-8 md:py-12 lg:py-16 text-white transition-transform duration-700 ease-out`}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div
          ref={sectionRef}
          className={`grid gap-6 md:grid-cols-3 lg:grid-cols-3 ${
            isVisible ? "fade-in-down" : ""
          }`}
        >
          {STATS_DATA.map((stat) => (
            <StatCard
              key={stat.id}
              number={stat.number}
              title={stat.title}
              text={stat.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
