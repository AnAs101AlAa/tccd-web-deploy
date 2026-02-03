import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import StatsSection from "../components/StatsSection";
import BlogSection from "../components/BlogSection";
import { WithNavbar } from "@/shared/components/hoc";

export default function HomePage (){
  return (
    <WithNavbar>
        <div className="flex flex-col">
        <HeroSection />
        <BlogSection />
        <StatsSection />
        <ServicesSection />
        </div>
    </WithNavbar>
  );
};
