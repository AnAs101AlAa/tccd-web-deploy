import { useRef, useEffect } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { COMPANIES_IMAGES } from "@/constants/companiesImages";

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  useEffect(() => {
    if (!carouselRef.current) return;

    const carousel = carouselRef.current;
    let currentOffset = 0;
    let animationId: number;
    let oneSetWidth = 0;

    const getAnimationSpeed = () => {
      const width = window.innerWidth;
      if (width < 768) return 1; // Mobile: slowest
      if (width < 1024) return 1.5; // Tablet: medium
      return 2; // Desktop: fastest
    };

    let speed = getAnimationSpeed();

    const calculateOneSetWidth = () => {
      const items = carousel.querySelectorAll(".carousel-item");
      if (items.length === 0) return 0;
      
      const firstItem = items[0] as HTMLElement;
      const itemWidth = firstItem.offsetWidth;
      const gap = window.innerWidth < 768 ? 16 : 32; // gap-4 or gap-8
      return (itemWidth + gap) * COMPANIES_IMAGES.length;
    };

    const animate = () => {
      currentOffset += speed;
      
      // Reset when we've scrolled one full set to create seamless loop
      if (oneSetWidth > 0 && currentOffset >= oneSetWidth) {
        currentOffset = 0;
      }
      
      carousel.style.transform = `translateX(-${currentOffset}px)`;
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      speed = getAnimationSpeed();
      oneSetWidth = calculateOneSetWidth();
    };

    // Calculate initial width after images load
    setTimeout(() => {
      oneSetWidth = calculateOneSetWidth();
    }, 100);

    window.addEventListener("resize", handleResize);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
              Trusted Network
            </h2>
            <p className="max-w-225 text-sm md:text-base lg:text-xl/relaxed text-gray-500">
                TCCD is proud to have been sponsored by leading companies in the industry throughout the years. These partnerships have enabled us to provide valuable resources, opportunities, and support to our members, helping them advance their careers and connect with potential employers. We are grateful for the continued support of our sponsors and look forward to fostering these relationships in the future.
            </p>
          </div>
        </div>

        <div className="mx-auto pt-4 md:pt-4 lg:pt-6 pb-3 md:pb-6 max-w-[96%] md:max-w-[84%] lg:max-w-3/4 overflow-hidden">
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-8"
            style={{
              transition: "none",
            }}
          >
            {[...COMPANIES_IMAGES, ...COMPANIES_IMAGES, ...COMPANIES_IMAGES].map((image, index) => (
              <div
                key={index}
                className="carousel-item h-20 md:h-32 lg:h-40 w-28 md:w-36 lg:w-44 flex items-center justify-center shrink-0 rounded-md bg-white"
              >
                <img
                  src={image}
                  alt={`Company ${index + 1}`}
                  className="h-full w-full object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
