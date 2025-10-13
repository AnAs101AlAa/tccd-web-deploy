import { NAV_ITEMS } from "@/constants/NavItems";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileMenu from "./components/ProfileMenu";
import logo from "@/assets/TCCD_logo.svg";
import facultyLogo from "@/assets/faculty.png";
import universityLogo from "@/assets/university.png";
const Navbar = () => {
  const { pathname } = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isAuthenticated = false;

  const handleAvatarClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <nav className="relative w-full h-[65px] bg-background">
      <div className="relative w-full max-w-[1600px] mx-auto h-full px-8">
        {/* Logos */}
        <div className="absolute left-[2%] top-[8.5px] flex items-center gap-3">
          <div className="flex items-center gap-3 h-[56px]">
            <img
              src={universityLogo}
              alt="University"
              className="h-full w-auto"
            />
            <img src={facultyLogo} alt="Faculty" className="h-full w-auto" />
          </div>
          <div className="h-[48px] w-[2px] bg-secondary opacity-30"></div>
          <img src={logo} alt="TCCD" className="h-[48px] w-auto" />
        </div>

        <div className="absolute left-[50%] -translate-x-1/2 top-[29.3%] flex items-center gap-8 xl:gap-12">
          {NAV_ITEMS.map(({ to, title }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={title}
                to={to}
                className={`font-poppins font-bold text-xl xl:text-2xl leading-9 whitespace-nowrap ${
                  active ? "text-primary" : "text-secondary"
                } hover:opacity-80 transition-opacity`}
              >
                {title}
              </Link>
            );
          })}
        </div>

        {/* Profile Avatar or Login Link */}
        <div className="absolute right-[2%] top-1/2 -translate-y-1/2">
          {isAuthenticated ? (
            <>
              <ProfileAvatar
                isAuthenticated={isAuthenticated}
                onClick={handleAvatarClick}
              />

              <ProfileMenu
                isOpen={showProfileMenu}
                onClose={() => {
                  setShowProfileMenu(false);
                }}
                isAuthenticated={isAuthenticated}
                position="bottom"
              />
            </>
          ) : (
            <Link
              to="/signin"
              className="font-poppins font-semibold text-xl text-secondary hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
