import { ServiceCard } from "./components/ServiceCard";
import { useRef } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { SERVICES_DATA } from "../constants";

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  const firstGridServices = SERVICES_DATA.slice(0, 6);
  const secondGridServices = SERVICES_DATA.slice(6);

  return (
    <section className="py-10 md:py-16 lg:py-24 transition-transform duration-700 ease-out">
      <div
        ref={sectionRef}
        className={`container px-3 md:px-6 mx-auto ${
          isVisible ? "fade-in-up" : ""
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4 text-center">
          <div className="space-y-1 md:space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-2 py-1 text-xs md:text-sm text-[#295E7E]">
              Our Services
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl text-blue-950">
              Career Advancement Opportunities
            </h2>
            <p className="max-w-225 text-sm md:text-base lg:text-xl/relaxed text-gray-500">
              TCCD aims at offering career advancement opportunities for
              undergraduates and graduates in all engineering disciplines. We
              bridge the gap between students and industry through various
              programs and events.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl items-center gap-3 md:gap-6 pt-6 md:pt-8 lg:pt-12 pb-3 md:pb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {firstGridServices.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        {/* Additional services row */}
        <div className="mx-auto grid max-w-5xl items-center gap-3 md:gap-6 py-1 md:py-2 grid-cols-1 md:grid-cols-2">
          {secondGridServices.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
