import {
  FaLaptopCode,
  FaBriefcase,
  FaAward,
  FaBuilding,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";
import { GiPublicSpeaker } from "react-icons/gi";
import { MdOutlineEventAvailable } from "react-icons/md";
import { ServiceCard } from "./ServiceCard";

const ServicesSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-24">
      <div className="container px-3 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4 text-center">
          <div className="space-y-1 md:space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-2 py-1 text-xs md:text-sm text-[#295E7E]">
              Our Services
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl text-blue-950">
              Career Advancement Opportunities
            </h2>
            <p className="max-w-[900px] text-sm md:text-base lg:text-xl/relaxed text-gray-500">
              TCCD aims at offering career advancement opportunities for
              undergraduates and graduates in all engineering disciplines. We
              bridge the gap between students and industry through various
              programs and events.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl items-center gap-3 md:gap-6 py-6 md:py-8 lg:py-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            icon={
              <FaLaptopCode className="h-8 w-8 md:h-10 md:w-10 text-[#cd3a38]" />
            }
            title="Training Courses"
            description="Specialized technical courses to enhance your skills and prepare you for the job market in various engineering fields."
          />
          <ServiceCard
            icon={
              <GiPublicSpeaker className="h-8 w-8 md:h-10 md:w-10 text-[#295E7E]" />
            }
            title="Workshops"
            description="Hands-on workshops led by industry professionals to develop practical skills essential for your engineering career."
          />
          <ServiceCard
            icon={
              <FaBriefcase className="h-8 w-8 md:h-10 md:w-10 text-[#cd3a38]" />
            }
            title="Job Fairs"
            description="Connect directly with potential employers at our job fairs featuring companies from various engineering sectors."
          />
          <ServiceCard
            icon={
              <FaAward className="h-8 w-8 md:h-10 md:w-10 text-[#295E7E]" />
            }
            title="Competitions"
            description="Showcase your talents and problem-solving abilities in engineering competitions judged by industry experts."
          />
          <ServiceCard
            icon={
              <FaBuilding className="h-8 w-8 md:h-10 md:w-10 text-[#cd3a38]" />
            }
            title="Exhibitions"
            description="Display your projects and innovations at exhibitions attended by industry leaders and potential employers."
          />
          <ServiceCard
            icon={
              <MdOutlineEventAvailable className="h-8 w-8 md:h-10 md:w-10 text-[#295E7E]" />
            }
            title="Recruitment Events"
            description="Dedicated recruitment events where companies interview and select candidates for internships and jobs."
          />
        </div>

        {/* Additional services row */}
        <div className="mx-auto grid max-w-5xl items-center gap-3 md:gap-6 py-1 md:py-2 grid-cols-1 md:grid-cols-2">
          <ServiceCard
            icon={
              <FaUsers className="h-8 w-8 md:h-10 md:w-10 text-[#cd3a38]" />
            }
            title="Seminars & Lectures"
            description="Informative sessions by industry leaders and academics covering emerging trends and technologies in engineering."
          />
          <ServiceCard
            icon={
              <FaHandshake className="h-8 w-8 md:h-10 md:w-10 text-[#295E7E]" />
            }
            title="Industry Connections"
            description="We establish valuable links between senior students, fresh graduates, and industry partners for career opportunities."
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
