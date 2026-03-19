import { useRef } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import companyCollage from "@/assets/companyCollage.jpeg";

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  return (
    <section className="py-2 md:py-4 lg:py-6 transition-transform duration-700 ease-out">
      <div
        ref={sectionRef}
        className={`container px-3 md:px-6 mx-auto ${
          isVisible ? "fade-in-up" : ""
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4 text-center">
          <div className="space-y-1 md:space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-2 py-1 text-xs md:text-sm text-[#295E7E]">
              Our Partners
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl text-blue-950">
              Sponsored Companies
            </h2>
            <p className="max-w-225 text-sm md:text-base lg:text-xl/relaxed text-gray-500">
                TCCD is proud to have been sponsored by leading companies in the industry throughout the years. These partnerships have enabled us to provide valuable resources, opportunities, and support to our members, helping them advance their careers and connect with potential employers. We are grateful for the continued support of our sponsors and look forward to fostering these relationships in the future.
            </p>
          </div>
        </div>

        <div className="mx-auto pt-3 md:pt-4 lg:pt-6 pb-3 md:pb-6 max-w-[96%] md:max-w-[84%] lg:max-w-3/4">
            <img src={companyCollage} alt="Company Collage" className="w-full h-auto object-cover" />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
