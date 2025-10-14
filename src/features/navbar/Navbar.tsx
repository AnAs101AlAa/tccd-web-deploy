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
    <nav className="relative w-full bg-background h-[70px] shadow-lg">
      <div className="w-[94%] xl:w-[90%] flex items-center justify-between h-full mx-auto">
        {/* Logos */}
        <div className="flex items-center gap-4">
          <img
            src={universityLogo}
            alt="University"
            className="h-[46px] xl:h-[56px] w-auto"
          />
          <img
            src={facultyLogo}
            alt="Faculty"
            className="h-[44px] xl:h-[53px] w-auto"
          />
        </div>
        
        <div className="flex items-center gap-5 xl:gap-8">
          {NAV_ITEMS.slice(0, Math.ceil(NAV_ITEMS.length / 2)).map(({ to, title }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
          key={title}
          to={to}
          className={`font-bold text-base xl:text-lg leading-7 whitespace-nowrap ${
            active ? "text-primary" : "text-secondary"
          } hover:opacity-80 transition-opacity`}
              >
          {title}
              </Link>
            );
          })}
          <img src={logo} alt="TCCD" className="h-[28px] xl:h-[32px] w-auto" />
          {NAV_ITEMS.slice(Math.ceil(NAV_ITEMS.length / 2)).map(({ to, title }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
          key={title}
          to={to}
          className={`font-bold text-base xl:text-lg leading-7 whitespace-nowrap ${
            active ? "text-primary" : "text-secondary"
          } hover:opacity-80 transition-opacity`}
              >
          {title}
              </Link>
            );
          })}
        </div>

        {/* Profile Avatar or Login Link */}
        <div className="relative">
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
