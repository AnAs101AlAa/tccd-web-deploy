import { IoTicketOutline } from "react-icons/io5";
import { TbChartArrowsVertical } from "react-icons/tb";
import { BiNetworkChart } from "react-icons/bi";
import { StatCard } from "./StatCard";
import { useState, useEffect, useRef } from "react";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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
          <StatCard
            number={<IoTicketOutline className="text-6xl mx-auto" />}
            title="All your reservations in one place"
            text="Register to any event in two clicks, save your tickets, keep track of all upstanding registrations all in one place"
          />

          <StatCard
            number={
              <TbChartArrowsVertical className="text-6xl mx-auto stroke-1" />
            }
            title="Our numbers and milestones on full display"
            text="A record of our past events numbers and galleries where you can witness our goals and rise"
          />

          <StatCard
            number={<BiNetworkChart className="text-6xl mx-auto" />}
            title="Your newest and fastest point of contact"
            text="A hub where you can learn all about what we stand for, reach into our social media platforms and official contacts"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
