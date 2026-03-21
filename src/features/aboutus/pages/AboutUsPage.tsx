import React, { useRef } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import toast from "react-hot-toast";
import UpperHeader from "@/shared/components/mainpages/UpperHeader";
import boardMembers from "@/assets/boardMembers.json";
import websiteFounders from "@/assets/websiteFounders.json";
import type { BoardMember, WebsiteFounder } from "@/shared/types";
import VisionIcon from "@/assets/vision.svg";
import MissionIcon from "@/assets/mission.svg";
import GoalIcon from "@/assets/goal.svg";
import WithLayout from "@/shared/components/hoc/WithLayout";
import ABOUT_US_HEADER_IMAGE from "@/assets/aboutusTopHeader.jpg";

const socialIcons = [
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "https://www.facebook.com/TCCD.ENG",
    color: "#1877F2",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/tccdcommunity/",
    color: "#E4405F",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tccdeng/",
    color: "#0077B5",
  },
  {
    icon: FaTiktok,
    label: "TikTok",
    href: "https://www.tiktok.com/@tccdcommunity?_t=ZS-8vfYm3XQ50U&_r=1",
    color: "#000000",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    href: "https://www.whatsapp.com/channel/0029Vaiig1I96H4KsF2AEc1a",
    color: "#25D366",
  },
];

export const AboutUsPage = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const foundersRef = useRef<HTMLDivElement>(null);

  const scrollBoard = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = 290;
      const maxScrollLeft =
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const newScrollLeft =
        carouselRef.current.scrollLeft + direction * scrollAmount;

      if (newScrollLeft < 0) {
        carouselRef.current.scrollLeft = 0;
      } else if (newScrollLeft > maxScrollLeft) {
        carouselRef.current.scrollLeft = maxScrollLeft;
      } else {
        carouselRef.current.scrollBy({
          left: direction * scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollFounders = (direction: number) => {
    if (foundersRef.current) {
      const scrollAmount = 290;
      const maxScrollLeft =
        foundersRef.current.scrollWidth - foundersRef.current.clientWidth;
      const newScrollLeft =
        foundersRef.current.scrollLeft + direction * scrollAmount;

      if (newScrollLeft < 0) {
        foundersRef.current.scrollLeft = 0;
      } else if (newScrollLeft > maxScrollLeft) {
        foundersRef.current.scrollLeft = maxScrollLeft;
      } else {
        foundersRef.current.scrollBy({
          left: direction * scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${type} copied to clipboard!`);
      })
      .catch(() => {
        toast.error(`Failed to copy ${type}`);
      });
  };

  return (
    <WithLayout>
      <div className="relative font-sans bg-gray-50">
        <UpperHeader
          image={ABOUT_US_HEADER_IMAGE}
          title="About us"
          subtitle="Catch a brief hint of TCCD, Our vision, mission, and goals, why we do what we do and our teams."
        />

        <div className="mx-auto text-center mt-8 md:mt-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-linear-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent">
            TCCD Director
          </h1>
          <div className="shrink-0 flex flex-col md:flex-row justify-center items-center mx-auto w-100 md:w-160 max-w-[96%] bg-white p-5 md:p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform snap-center">
            <img
              src="https://res.cloudinary.com/dwqke70ki/image/upload/v1773168405/WhatsApp_Image_2026-03-10_at_7.17.22_PM_tivjfu.jpg"
              alt={`Dr Samah El-Shafiey - TCCD Director`}
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover object-center mx-auto mb-4 md:mb-0 bg-gray-200"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (
                  target.src !==
                  "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif"
                ) {
                  target.src =
                    "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif";
                }
              }}
            />
            <div>
              <p className="font-bold text-gray-800 text-center text-lg md:text-xl mb-3">
                Dr Samah El-Shafiey El-Tantawy
              </p>
              <p className="text-gray-600 text-sm md:text-base lg:text-md mx-auto px-4 mb-4 max-w-lg">
                Fostering student growth, bridging academia and industry, and
                connecting graduates to opportunities, driven by a passion to
                support and empower.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto text-center mt-8 md:mt-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-linear-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent">
            Board members
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto px-4 mb-4">
            Meet the dedicated engineering student volunteering leaders who
            guide TCCD's strategic vision and ensure our commitment to
            empowering students and graduates in their career journeys.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-5 relative pb-8 md:pb-12">
          <button
            onClick={() => scrollBoard(-1)}
            className="absolute left-2 md:left-0 lg:left-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowLeft className="text-gray-800 text-sm md:text-base" />
          </button>
          <button
            onClick={() => scrollBoard(1)}
            className="absolute right-2 md:right-0 lg:right-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowRight className="text-gray-800 text-sm md:text-base" />
          </button>
          <div
            ref={carouselRef}
            className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 py-6 md:py-8 px-2 mx-8 md:mx-10"
          >
            {(boardMembers as BoardMember[]).map((member, i) => (
              <div
                key={i}
                className="shrink-0 w-56 md:w-64 bg-white p-5 md:p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform snap-center"
              >
                <img
                  src={
                    member.ImgSrc ||
                    "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif"
                  }
                  alt={`${member.Name} - Board Member`}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover object-center mx-auto mb-3 md:mb-4 bg-gray-200"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (
                      target.src !==
                      "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif"
                    ) {
                      target.src =
                        "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif";
                    }
                  }}
                />
                <h3 className="font-semibold text-gray-800 text-center text-base md:text-lg">
                  {member.Name}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm text-center">
                  {member.Role}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto text-center mt-4 md:mt-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-linear-to-r from-[#295E7E] to-[#CD3A38] bg-clip-text text-transparent">
            Website Founders
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-3xl mx-auto px-4 mb-4">
            With a passion for technology and a commitment to excellence, our
            volunteering founders have been instrumental in shaping the vision
            and mission of TCCD's digital identity.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-5 relative pb-8 md:pb-16">
          <button
            onClick={() => scrollFounders(-1)}
            className="absolute left-2 md:left-0 lg:left-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowLeft className="text-gray-800 text-sm md:text-base" />
          </button>
          <button
            onClick={() => scrollFounders(1)}
            className="absolute right-2 md:right-0 lg:right-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 md:w-10 md:h-10 shadow-lg z-10 hover:cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300"
          >
            <FaArrowRight className="text-gray-800 text-sm md:text-base" />
          </button>
          <div
            ref={foundersRef}
            className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 py-6 md:py-8 px-2 mx-8 md:mx-10"
          >
            {(websiteFounders as WebsiteFounder[]).map((founder, i) => (
              <div
                key={i}
                className="shrink-0 w-56 md:w-64 bg-white p-5 md:p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform snap-center"
              >
                <img
                  src={
                    founder.ImgSrc ||
                    "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif"
                  }
                  alt={`${founder.Name} - Website Founder`}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover object-center mx-auto mb-3 md:mb-4 bg-gray-200"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (
                      target.src !==
                      "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif"
                    ) {
                      target.src =
                        "https://res.cloudinary.com/do0yekzmf/image/upload/v1772147019/user_ednibp.avif";
                    }
                  }}
                />
                <h3 className="font-semibold text-gray-800 text-center mb-1 text-base md:text-lg">
                  {founder.Name}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm text-center mb-3 md:mb-4">
                  {founder.Role}
                </p>

                <div className="flex items-center justify-center gap-3 md:gap-4 mt-3 md:mt-4">
                  {founder.email && (
                    <button
                      onClick={() => copyToClipboard(founder.email!, "Email")}
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#EA4335] text-white rounded-full hover:bg-[#d33426] transition-all hover:scale-110 cursor-pointer shadow-md"
                      title="Copy email to clipboard"
                    >
                      <SiGmail size={16} className="md:w-4.5 md:h-4.5" />
                    </button>
                  )}
                  {founder.linkedin && (
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#0077B5] text-white rounded-full hover:bg-[#006396] transition-all hover:scale-110 shadow-md"
                      title="Open LinkedIn profile"
                    >
                      <FaLinkedin size={16} className="md:w-4.5 md:h-4.5" />
                    </a>
                  )}
                  {founder.github && (
                    <button
                      onClick={() =>
                        copyToClipboard(founder.github!, "GitHub URL")
                      }
                      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-[#333333] text-white rounded-full hover:bg-[#222222] transition-all hover:scale-110 cursor-pointer shadow-md"
                      title="Copy GitHub URL to clipboard"
                    >
                      <FaGithub size={16} className="md:w-4.5 md:h-4.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-linear-to-br from-[#44697E] via-[#5a7a8f] to-[#CD3A38] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-12 md:mb-16">
              <div className="relative order-1 md:order-2">
                <div
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                  style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
                >
                  <img
                    src={VisionIcon}
                    alt="Vision"
                    className="w-9 h-10 mb-1 md:mb-3 md:w-13.5 md:h-14"
                  />
                  <h3 className="text-[#44697E] text-lg md:text-2xl font-bold">
                    Vision
                  </h3>
                </div>
              </div>
              <div className="flex-1 text-white md:pr-6 lg:pr-8 order-2 md:order-1">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-center md:text-left font-bold">
                  Fostering students to pursue rewarding career paths and
                  offering continual learning opportunities to faculty
                  graduates.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
              <div className="relative order-1">
                <div
                  className="w-36 h-36 md:w-56 md:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                  style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
                >
                  <img
                    src={MissionIcon}
                    alt="Mission"
                    className="w-9 h-9 mb-1 md:mb-3 md:w-12 md:h-12"
                  />
                  <h3 className="text-[#CD3A38] text-lg md:text-2xl font-bold">
                    Mission
                  </h3>
                </div>
              </div>
              <div className="flex-1 text-white md:pl-6 lg:pl-8 order-2">
                <p className="text-base md:text-lg lg:text-xl leading-relaxed text-center md:text-left font-bold">
                  To empower students and graduates to excel by fostering a
                  supportive environment that address workplace demands and
                  create a lasting positive impact on society.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
              <div className="relative order-1 md:order-2 mx-auto md:mx-0">
                <div
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/90 flex flex-col items-center justify-center shadow-2xl"
                  style={{ borderRadius: "70% 30% 50% 50% / 40% 60% 40% 60%" }}
                >
                  <img
                    src={GoalIcon}
                    alt="Goals"
                    className="w-9 h-9 mb-1 md:mb-3 md:w-12 md:h-12"
                  />
                  <h3 className="text-[#44697E] text-lg md:text-2xl font-bold">
                    Goals
                  </h3>
                </div>
              </div>
              <div className="flex-1 text-white order-2 md:order-1 font-bold">
                <ul className="space-y-2 md:space-y-3 list-none">
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Provide quality services and training to boost
                      employability
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Partner with public and private entities to support
                      initiatives
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Develop career services to improve employability
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Launch initiatives to serve TCCD stakeholders and partners
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Strengthen TCCD's network and resources
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 md:mr-3 mt-1">•</span>
                    <span className="text-sm md:text-base lg:text-lg">
                      Generate revenue for sustainability and growth
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="py-12 md:py-16 px-4 md:px-5 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="p-6 md:p-8 rounded-xl">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center 
                    bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent"
              >
                Follow Us
              </h2>
              <p className="text-conrast text-sm md:text-base lg:text-lg text-center mb-8">
                Stay connected with TCCD through our social media channels.
              </p>
              <div className="max-w-6xl mx-auto px-5 text-center">
                <div className="flex justify-center gap-8 flex-wrap mb-8">
                  {socialIcons.map(
                    ({ icon: Icon, label, href: Href, color: Color }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-2"
                      >
                        <a
                          target="_blank"
                          href={Href}
                          className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 rounded-full bg-gray-400 flex items-center justify-center transition-colors duration-300"
                          style={
                            { "--tw-hover-bg": Color } as React.CSSProperties
                          }
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = Color)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "rgb(156, 163, 175)")
                          }
                          aria-label={label}
                        >
                          <Icon className="w-5 md:w-6 lg:w-7 h-5 md:h-6 lg:h-7 text-white" />
                        </a>
                        <p className="text-xs md:text-sm font-medium text-gray-700">
                          {label}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-linear-to-r from-secondary to-primary text-white text-center py-6 md:py-8">
          <p className="text-xs md:text-sm">
            &copy; {new Date().getFullYear()} TCCD. All rights reserved.
          </p>
        </footer>
      </div>
    </WithLayout>
  );
};
