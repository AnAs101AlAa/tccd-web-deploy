import { FaChevronRight, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import StatItem from "./components/StatItem";
import { useNavigate } from "react-router-dom";
import type { StudentUser } from "@/shared/types/users";
import { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "@/shared/store";
import { isAdmin } from "@/shared/types/users";
import { animateCounter } from "../utils/utils";
import { Button, ButtonTypes, ButtonWidths, LazyImageLoader } from "tccd-ui";
import { BACKGROUND_PATTERN } from "../constants";

const HeroSection = () => {
  const navigate = useNavigate();
  const [eventsCount, setEventsCounter] = useState<number>(0);
  const [companyCount, setCompanyCount] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<string[]>([
    ...Array(5).fill("user.jpg"),
  ]);
  const [usersCount, setUsersCount] = useState<number>(30);

  const handleEventClick = useCallback(() => {
    navigate("/events");
  }, [navigate]);

  const userData = useCurrentUser() as StudentUser | null;

  const handleLoginClick = useCallback(() => {
    if (userData && isAdmin(userData)) {
      navigate("/admin/events");
    } else if (userData && userData.id != "") {
      navigate(`/profile`);
    } else {
      navigate("/login");
    }
  }, [userData, navigate]);

  useEffect(() => {
    const handleActiveUsers = async () => {
      try {
        const response = { pictures: [], activeUserCount: 25 };
        setActiveUsers([
          ...response.pictures,
          ...Array(Math.max(0, 5 - response.pictures.length)).fill("user.jpg"),
        ]);
        const inflation =
          response.activeUserCount + Math.floor(Math.random() * 21) + 10;
        setUsersCount(inflation);
      } catch (error) {
        console.error("Error fetching active users:", error);
        setActiveUsers([...Array(5).fill("user.jpg")]);
        setUsersCount(30);
      }
    };

    animateCounter(setEventsCounter, 40, 5, 80, 200);
    animateCounter(setCompanyCount, 30, 5, 80, 300);
    handleActiveUsers();
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-secondary via-[#2B4C5E] to-primary py-12 md:py-16 lg:py-20">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: BACKGROUND_PATTERN,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main content container */}
      <div className="container relative px-4 md:px-6 mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left column with text content */}
          <div className="flex flex-col justify-center space-y-5 text-white xl:pt-8 fade-in-left">
            <div className="inline-block">
              <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm border border-white/20">
                <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                Technical Center for Career Development
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Shape Your</span>
              <span className="block mt-1 bg-linear-to-r from-white to-red-300 bg-clip-text text-transparent">
                Professional Future
              </span>
            </h1>

            {/* Supporting text */}
            <p className="max-w-150 text-sm md:text-lg lg:text-xl text-blue-100">
              Connecting education with opportunity. We empower students to
              discover their potential and build successful careers through
              expert guidance and industry connections.
            </p>

            <div className="flex sm:flex-row gap-4 pt-4">
              <Button
                type={ButtonTypes.PRIMARY}
                buttonText="Explore Events"
                buttonIcon={<FaChevronRight className="ml-2 h-4 w-4" />}
                width={ButtonWidths.FIT}
                onClick={handleEventClick}
                className="text-[14px] md:text-[16px] lg:text-[18px] px-4 md:px-8 py-2 md:py-3 bg-primary hover:bg-[#b33432] border-0 text-white hover:text-white"
              />
              <Button
                type={ButtonTypes.SECONDARY}
                buttonText={
                  userData && isAdmin(userData)
                    ? "Admin dashboard"
                    : userData && userData.id != ""
                      ? "Profile"
                      : "Login"
                }
                width={ButtonWidths.FIT}
                onClick={handleLoginClick}
                className="text-[14px] md:text-[16px] lg:text-[18px] px-8 py-2 md:py-3 text-white border-[#295E7E] bg-[#295E7E] hover:bg-[#1d4259] hover:text-white hover:border-[#295E7E]"
              />
            </div>

            {/* Round avatars might remove */}
            <div className="flex items-center gap-4 md:gap-8 pt-3 md:pt-6">
              <div className="flex -space-x-2">
                {/* Active user avatars */}
                {activeUsers.slice(0, 5).map((user, index) => (
                  <div
                    key={index}
                    className="inline-block h-8 md:h-10 w-8 md:w-10 rounded-full border-2 border-[#295E7E] bg-white/90 overflow-hidden"
                  >
                    <LazyImageLoader
                      src={user}
                      alt={`User ${index + 1}`}
                      className="h-full w-full object-cover"
                      width="100%"
                      height="100%"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-blue-100">
                <span className="font-semibold text-white">
                  {usersCount > 100 ? "100+" : usersCount}
                </span>{" "}
                Active Users
              </div>
            </div>
          </div>

          {/* Right column with image and stats */}
          <div className="hidden md:block relative mx-auto lg:mx-0 fade-in-right">
            <div className="relative z-10 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-2 shadow-2xl">
              <div className="aspect-4/3 overflow-hidden rounded-xl">
                <LazyImageLoader
                  className="w-full h-full inset-0"
                  src="home.jpeg"
                  alt="Hero Image"
                  width="100%"
                  height="100%"
                />
              </div>

              <StatItem
                positionClass="-right-1 -bottom-1"
                bgClass="bg-secondary"
                iconBgClass="bg-[#1d4259]"
                Icon={FaGraduationCap}
                labelCount={companyCount}
                labelText="Companies affliated"
                labelColorClass="text-blue-100"
              />
              <StatItem
                positionClass="-left-2 -top-2"
                bgClass="bg-primary"
                iconBgClass="bg-[#b33432]"
                Icon={FaBriefcase}
                labelCount={eventsCount}
                labelText="Completed Events"
                labelColorClass="text-red-100"
              />
            </div>
            <div className="absolute -z-10 h-40 w-40 rounded-full bg-secondary blur-[100px] -top-10 -left-5 opacity-50"></div>
            <div className="absolute -z-10 h-40 w-40 rounded-full bg-primary blur-[100px] -bottom-10 -right-5 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
