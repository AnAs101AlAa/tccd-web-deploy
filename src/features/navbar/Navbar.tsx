import { NAV_ITEMS } from "@/constants/NavItems";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileMenu from "./components/ProfileMenu";
import logo from "@/assets/TCCD_logo.svg";
import facultyLogo from "@/assets/faculty.png";
import universityLogo from "@/assets/university.png";
import { useAppSelector } from "@/shared/store/hooks";
import { selectIsAuthenticated } from "@/shared/store/selectors/userSelectors";

const Navbar = () => {
  const { pathname } = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  console.log("Is Authenticated:", isAuthenticated);

  const handleAvatarClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <nav className="relative w-full h-[52px] bg-background">
      <div className="relative w-full max-w-[1200px] mx-auto h-full px-4">
        {/* Logos */}
        <div className="absolute left-[2%] top-[5.9px] flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img
              src={universityLogo}
              alt="University"
              className="h-[38px] xl:h-[44px] w-auto"
            />
            <img
              src={facultyLogo}
              alt="Faculty"
              className="h-[38px] xl:h-[44px] w-auto"
            />
          </div>
          <div className="h-[28px] w-[2px] bg-secondary opacity-30"></div>
          <img src={logo} alt="TCCD" className="h-[28px] xl:h-[32px] w-auto" />
        </div>

        <div className="absolute left-[50%] -translate-x-1/2 top-[29.3%] flex items-center gap-5 xl:gap-8">
          {NAV_ITEMS.map(({ to, title }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={title}
                to={to}
                className={`font-poppins font-bold text-base xl:text-lg leading-7 whitespace-nowrap ${
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
              to="/login"
              className="font-poppins font-semibold text-base text-secondary hover:text-primary transition-colors"
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
