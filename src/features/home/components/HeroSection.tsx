import { FaGraduationCap, FaBriefcase, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { StudentUser } from "@/shared/types/users";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/shared/store";
import { isAdmin } from "@/shared/types/users";

const HeroSection = () => {
  const navigate = useNavigate();
  const [eventsCount, setEventsCounter] = useState<number>(0);
  const [companyCount, setCompanyCount] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<string[]>([...Array(5).fill(
    "user.jpg")
  ]);
  const [usersCount, setUsersCount] = useState<number>(30);

  const handleEventClick = () => {
    navigate("/events");
  };

  const userData = useCurrentUser() as StudentUser | null;

  const handleLoginClick = () => {
    if (userData && isAdmin(userData)) {
      navigate("/admin/events");
    } else if (userData && userData.id != "") {
      navigate(`/profile`);
    } else {
      navigate("/login");
    }
  };

  useEffect (() => {

    const handleActiveUsers = async () => {
    try {
      const response = {pictures: [], activeUserCount: 25};
      setActiveUsers([
        ...response.pictures,
        ...Array(Math.max(0, 5 - response.pictures.length)).fill(
          "user.jpg"
        ),
      ]);
      const inflation = response.activeUserCount + Math.floor(Math.random() * 21) + 10;
      setUsersCount(inflation)
    } catch (error) {
      console.error("Error fetching active users:", error);
      setActiveUsers([
        ...Array(5).fill(
          "user.jpg"
        ),
      ]);
      setUsersCount(30);
    }
  }

  const companyCounter = async () => {
    const totalSteps = 15;
    const startSpeed = 5;
    const endSpeed = 80;
    const initialDelay = 300;
  
    await new Promise(resolve => setTimeout(resolve, initialDelay));
  
    for (let i = 0; i < totalSteps; i++) {
      const progress = i / totalSteps;
      const delay = startSpeed + (endSpeed - startSpeed) * Math.pow(progress, 2);
      
      setTimeout(() => {
        setCompanyCount((prevCount) => prevCount + 1);
      }, i === 0 ? 0 : delay * i);
    }
  };

  const eventsCounter = async () => {
    const totalSteps = 20;
    const startSpeed = 5;
    const endSpeed = 80;
    const initialDelay = 300;
  
    await new Promise(resolve => setTimeout(resolve, initialDelay));
  
    for (let i = 0; i < totalSteps; i++) {
      const progress = i / totalSteps;
      const delay = startSpeed + (endSpeed - startSpeed) * Math.pow(progress, 2);
      
      setTimeout(() => {
        setEventsCounter((prevCount) => prevCount + 1);
      }, i === 0 ? 0 : delay * i);
    }
  };

  eventsCounter();
  companyCounter();
  handleActiveUsers();
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-secondary via-[#2B4C5E] to-primary py-12 md:py-16 lg:py-20">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main content container */}
      <div className="container relative px-4 md:px-6 mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left column with text content */}
          <div className="flex flex-col justify-center space-y-5 text-white xl:pt-8 fade-in-left">
            {/* Badge indicator still thinking remove or no*/}
            <div className="inline-block">
              <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm border border-white/20">
                <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                Technical Center for Career Development
              </div>
            </div>

            {/* Main headline */}
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

            {/* Call-to-action buttons */}
            <div className="flex sm:flex-row gap-4 pt-4">
              <button
                className="bg-primary cursor-pointer hover:bg-[#b33432] text-[14px] md:text-[16px] lg:text-[18px] text-white border-0 rounded-full w-fit px-4 md:px-8 py-2 md:py-3 font-medium flex items-center justify-center"
                onClick={handleEventClick}
              >
                Explore Events
                <FaChevronRight className="ml-2 h-4 w-4" />
              </button>
              <button
                className="border cursor-pointer text-[14px] md:text-[16px] lg:text-[18px] border-[#295E7E] bg-[#295E7E] text-white hover:bg-[#1d4259] w-fit rounded-full px-8 py-2 md:py-3 font-medium flex items-center justify-center"
                onClick={handleLoginClick}
              >
                {userData && isAdmin(userData) ? "Admin dashboard" : userData && userData.id != "" ? "Profile" : "Login"}
              </button>
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
                  <img
                    src={user}
                    alt={`User ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  </div>
                ))}
                </div>
              <div className="text-sm text-blue-100">
                <span className="font-semibold text-white">{usersCount > 100 ? "100+" : usersCount}</span> Active
                Users
              </div>
            </div>
          </div>

          {/* Right column with image and stats - hidden on mobile screens */}
          <div className="hidden md:block relative mx-auto lg:mx-0 fade-in-right">
            <div className="relative z-10 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-2 shadow-2xl">
              <div className="aspect-4/3 overflow-hidden rounded-xl">
                <img
                  className="w-full h-full inset-0"
                  src="home.jpeg"
                />
              </div>

              {/* Stats overlays */}
              <div className="absolute -right-1 -bottom-1 z-20 rounded-xl bg-[#295E7E] p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#1d4259] p-1">
                    <FaGraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-100">
                      Companies affliated{" "}
                    </div>
                    <div className="text-xl font-bold text-white">{companyCount}</div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-2 -top-2 z-20 rounded-xl bg-[#cd3a38] p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#b33432] p-1">
                    <FaBriefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-red-100">
                      Completed Events
                    </div>
                    <div className="text-xl font-bold text-white">{eventsCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* blur effects */}
            <div className="absolute -z-10 h-40 w-40 rounded-full bg-[#295E7E] blur-[100px] -top-10 -left-5 opacity-50"></div>
            <div className="absolute -z-10 h-40 w-40 rounded-full bg-[#cd3a38] blur-[100px] -bottom-10 -right-5 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
