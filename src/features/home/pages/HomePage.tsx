import { Suspense, lazy } from "react";
import HeroSection from "../components/HeroSection";
import { WithNavbar } from "@/shared/components/hoc";
// Sections below the fold are deferred to cut initial bundle size
const BlogSection = lazy(() => import("../components/BlogSection"));
const StatsSection = lazy(() => import("../components/StatsSection"));
const ServicesSection = lazy(() => import("../components/ServicesSection"));
const PartnersSection = lazy(() => import("../components/PartnersSection"));

export default function HomePage() {
  return (
    <WithNavbar>
      <div className="flex flex-col">
        <HeroSection />
        <Suspense fallback={null}>
          <BlogSection />
          <StatsSection />
          <ServicesSection />
          <PartnersSection />
        </Suspense>
      </div>
    </WithNavbar>
  );
};
